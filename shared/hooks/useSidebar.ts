import { useState, useCallback, useEffect, useRef } from 'react'
import { MenuItem } from '@/slices/sidebar/menu/types/'
import { useMenu } from '@/slices/sidebar/menu/nav-main/context/MenuContextStore'

interface UseSidebarProps {
  initialMenuId?: string
  initialIsOpen?: boolean
}

export const useSidebar = ({
  initialMenuId = 'main',
  initialIsOpen = true
}: UseSidebarProps = {}) => {
  const mountedRef = useRef(false)
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(initialIsOpen)
  const [currentMenuId, setCurrentMenuId] = useState<string>(initialMenuId)
  const { setCurrentDashboardId } = useMenu()

  // Check if we're on mobile based on window width
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px is a common breakpoint for mobile
    }

    // Initial check
    checkMobile()

    // Add resize listener
    window.addEventListener('resize', checkMobile)
    setMounted(true)
    console.log('[useSidebar] Component mounted');

    return () => {
      window.removeEventListener('resize', checkMobile)
      console.log('[useSidebar] Component unmounted');
    }
  }, [])

  const loadDashboardNavigation = useCallback((menuId: string, dashboardId?: string) => {
    if (!mounted) {
      console.log('[useSidebar] Not mounted, skipping navigation');
      return;
    }
    
    console.log('[useSidebar] Loading dashboard navigation:', { menuId, dashboardId });
    setCurrentMenuId(menuId);
    
    if (dashboardId) {
      console.log('[useSidebar] Setting current dashboard:', dashboardId);
      // Set dashboard ID with a slight delay to ensure state synchronization
      // This ensures we don't have race conditions in state updates
      setTimeout(() => {
        setCurrentDashboardId(dashboardId);
      }, 0);
    }
  }, [mounted, setCurrentDashboardId])

  const handleNavItemClick = useCallback((item: MenuItem) => {
    if (!mounted) {
      console.log('[useSidebar] Not mounted, skipping nav click');
      return;
    }
    
    console.log('[useSidebar] Nav item clicked:', {
      id: item.id,
      name: item.name,
      path: item.url?.href
    });

    // Close sidebar on mobile when clicking a nav item
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile, mounted])

  return {
    mounted,
    isOpen,
    isMobile,
    currentMenuId,
    handleNavItemClick,
    loadDashboardNavigation,
    setIsOpen,
    setCurrentMenuId,
  }
}