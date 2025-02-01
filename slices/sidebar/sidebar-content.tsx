"use client"

import React, { useEffect } from 'react'
import { DashboardSwitcher } from "@/slices/sidebar/dashboard/switcher/dashboard-switcher"
import { NavUser } from "@/slices/sidebar/menu/nav-user/nav-user"
import { MenuSection } from "@/slices/sidebar/menu/nav-main/components"
import { NavMain } from "@/slices/sidebar/menu/nav-main/nav-main"
import { NavProjects } from "@/slices/sidebar/menu/nav-projects/nav-projects"
import { navProjectsConfig } from "@/slices/sidebar/menu/nav-projects/config"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
  SidebarSeparator,
} from "@/shared/components/ui/sidebar"
import { Skeleton } from '@/shared/components/ui/skeleton';
import { 
  MenuItemWithChildren, 
  MenuSwitcher as MenuSwitcherType, 
  Menu, 
  MenuSwitcherItem 
} from '@/shared/types/navigation-types'
import { Dashboard } from '@/slices/sidebar/dashboard/types'
import { MenuSwitcher } from '@/slices/sidebar/menu/menu-switcher/menu-switcher'
import { useSidebar } from '@/shared/hooks/useSidebar'
import { useUser } from '@/shared/hooks/use-user'
import { useDashboard } from '@/slices/sidebar/dashboard/hooks/use-dashboard'
import { useMenuContext } from './menu/context/menu-context';

interface SidebarContentProps {
  type: 'default' | 'menuSwitcher'
  menuItems: MenuSwitcherType[] | MenuItemWithChildren[]
  isOpen?: boolean
  onDashboardChange: (dashboard: Dashboard) => void
  onMenuChange: (menu: MenuItemWithChildren) => void
  onFocus?: () => void
  renderIcon: (icon: string | undefined) => JSX.Element | null
  className?: string
  sidebarProps?: React.ComponentProps<typeof Sidebar>
}

export function SidebarContentWrapper({
  type,
  menuItems,
  isOpen = true,
  onDashboardChange,
  onMenuChange,
  onFocus,
  renderIcon,
  className,
  sidebarProps
}: SidebarContentProps) {
  const { isMobile, currentMenuId } = useSidebar()
  const { userId } = useUser()
  const { dashboards, isLoading, error: dashboardsError, refetch } = useDashboard()
  const { fetchMenu, menuItems: fetchedMenuItems, loading: menuLoading } = useMenuContext();
  
  // Handle cached dashboards while loading
  const visibleDashboards = isLoading ? [] : dashboards || []
  const selectedDashboard = visibleDashboards[0] || null

  useEffect(() => {
    if (selectedDashboard?.dashboardId) {
      fetchMenu(selectedDashboard.dashboardId);
    }
  }, [selectedDashboard?.dashboardId, fetchMenu]);

  // Add loading state
  if (isLoading) {
    return (
      <Sidebar collapsible="icon" {...sidebarProps}>
        <div className="space-y-2 p-2">
          <Skeleton className="h-12 w-full" />
        </div>
      </Sidebar>
    )
  }

  if (menuLoading) {
    return (
      <Sidebar collapsible="icon" {...sidebarProps}>
        <div className="space-y-2 p-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-full" />
        </div>
      </Sidebar>
    )
  }

  if (dashboardsError) {
    return <div>Error: {dashboardsError}</div>
  }

  // Convert fetched menu items to the expected format
  const menuSwitcher = React.useMemo(() => {
    if (!fetchedMenuItems?.length) {
      return menuItems[0] as MenuSwitcherType
    }

    // Convert fetched menu items to MenuItemWithChildren format
    const convertedMenuItems = fetchedMenuItems.map((item) => ({
      ...item,
      href: item.href || '#',
    }))

    // Create a menu switcher item with the converted menu items
    const defaultMenu: MenuSwitcherItem = {
      id: 'default',
      title: 'Default Menu',
      menuList: convertedMenuItems,
      dashboardId: selectedDashboard?.dashboardId,
      menuType: 'main'
    }

    return {
      title: 'Menu Switcher',
      menus: [defaultMenu]
    } as MenuSwitcherType
  }, [fetchedMenuItems, menuItems, selectedDashboard?.dashboardId])
  console.log('[Debug] Final Menu Switcher:', menuSwitcher)
  
  const regularMenus = React.useMemo(() => menuItems.slice(1) as MenuItemWithChildren[], [menuItems])
  
  const [selectedMenu, setSelectedMenu] = React.useState<MenuSwitcherItem | null>(null)
  
  // Reset selected menu when dashboard changes
  React.useEffect(() => {
    setSelectedMenu(null);
  }, [selectedDashboard?.dashboardId]);

  // Update selected menu when menu switcher changes
  React.useEffect(() => {
    console.log('[Debug] Menu Switcher Effect:', { menus: menuSwitcher?.menus, selectedMenu })
    if (menuSwitcher?.menus?.length && !selectedMenu) {
      setSelectedMenu(menuSwitcher.menus[0])
    }
  }, [menuSwitcher?.menus, selectedMenu])

  const handleMenuChange = React.useCallback((menu: MenuSwitcherItem) => {
    console.log('[Debug] Menu Change:', menu);
    setSelectedMenu(menu)
    if (menu.menuList?.length) {
      onMenuChange(menu.menuList[0])
    }
  }, [onMenuChange])

  return (
    <Sidebar collapsible="icon" {...sidebarProps}>
      <SidebarHeader>
        <DashboardSwitcher
          dashboards={visibleDashboards}
          isMobile={isMobile}
          className="mb-2"
          defaultDashboardId={currentMenuId}
        />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup>
            {menuSwitcher?.menus && (
              <MenuSwitcher 
                menuSwitcher={menuSwitcher}
                onMenuChange={handleMenuChange}
                isMobile={isMobile}
                className="mb-2"
              />
            )}
            {selectedMenu && selectedMenu.menuList?.length > 0 && (
              <MenuSection 
                items={selectedMenu.menuList}
                onSecondaryItemClick={onMenuChange}
                onFocus={onFocus}
                renderIcon={renderIcon}
              />
            )}
          </SidebarGroup>
          {regularMenus.length > 0 && (
            <MenuSection 
              items={regularMenus}
              onSecondaryItemClick={onMenuChange}
              onFocus={onFocus}
              renderIcon={renderIcon}
            />
          )}
          <NavMain />
          <NavProjects projects={navProjectsConfig.projects} />
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      {type === 'default' && !isMobile && <SidebarRail />}
    </Sidebar>
  )
}