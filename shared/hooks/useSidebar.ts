import { useState, useCallback, useEffect } from 'react'
import { MenuItemWithChildren } from '@/shared/types/navigation-types'
import { useMenu } from '@/slices/menu/context/MenuContextStore'
import { menuConfigs } from '@/slices/menu/context/menu-configs'

interface UseSidebarProps {
  initialMenuId?: string
  initialIsOpen?: boolean
}

export const useSidebar = ({
  initialMenuId = 'main',
  initialIsOpen = true
}: UseSidebarProps = {}) => {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(initialIsOpen)
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(false)
  const [secondaryItems, setSecondaryItems] = useState<MenuItemWithChildren[] | null>(null)
  const [currentMenuId, setCurrentMenuId] = useState<string>(initialMenuId)
  const { setMenuItems } = useMenu()

  // Check if we're on mobile based on window width
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px is a common breakpoint for mobile
    }

    // Initial check
    checkMobile()

    // Add resize listener
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const loadDashboardNavigation = useCallback((menuId: string) => {
    setCurrentMenuId(menuId);
    
    // If switching to a specific dashboard, only show its items
    if (menuId !== 'main' && menuConfigs[menuId]) {
      setMenuItems(menuConfigs[menuId] || []);
    } else {
      // If we're on main menu, show main items
      setMenuItems(menuConfigs.main || []);
    }
  }, [setMenuItems])

  useEffect(() => {
    setMounted(true)
    loadDashboardNavigation(initialMenuId)
  }, [loadDashboardNavigation, initialMenuId])

  useEffect(() => {
    if (mounted && currentMenuId !== 'main') {
      loadDashboardNavigation(currentMenuId)
    }
  }, [currentMenuId, loadDashboardNavigation, mounted])

  const handleNavItemClick = useCallback((item: MenuItemWithChildren) => {
    if (item.children) {
      setSecondaryItems(item.children)
      setIsSecondaryOpen(true)
      setIsOpen(true)
    }
  }, [])

  const handleSecondaryClose = useCallback(() => {
    setIsSecondaryOpen(false)
    setSecondaryItems(null)
  }, [])

  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  return {
    mounted,
    isOpen,
    isSecondaryOpen,
    secondaryItems,
    currentMenuId,
    isMobile,
    handleNavItemClick,
    handleSecondaryClose,
    setCurrentMenuId,
    toggleSidebar,
    setIsOpen,
    loadDashboardNavigation
  }
}