"use client"

import React from 'react'
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
import { useMenu } from '@/slices/sidebar/menu/hooks/use-menu'

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
  const { dashboards, loading: dashboardsLoading, error: dashboardsError, refetch } = useDashboard()
  const selectedDashboard = dashboards?.[0]
  const { menuItems: fetchedMenuItems, loading: menuLoading, error: menuError } = useMenu(selectedDashboard?.dashboardId)

  // Convert fetched menu items to the expected format
  const menuSwitcher = React.useMemo(() => {
    if (!fetchedMenuItems?.length) {
      return menuItems[0] as MenuSwitcherType
    }

    // Convert fetched menu items to MenuItemWithChildren format
    const convertedMenuItems = fetchedMenuItems.map(item => ({
      id: item.id,
      title: item.title,
      icon: item.icon,
      href: item.href,
      isActive: item.isActive,
      parentId: item.parentId,
      orderIndex: item.orderIndex,
      dashboardId: item.dashboardId,
      menuType: item.menuType
    })) as MenuItemWithChildren[]

    // Create a menu switcher item with the converted menu items
    const defaultMenu: MenuSwitcherItem = {
      id: 'default',
      title: 'Default Menu',
      menuList: convertedMenuItems,
      dashboardId: selectedDashboard?.dashboardId,
      menuType: 'main'
    }

    return {
      id: 'menu-switcher',
      title: 'Menu Switcher',
      menus: [defaultMenu]
    } as MenuSwitcherType
  }, [fetchedMenuItems, menuItems, selectedDashboard?.dashboardId])

  const regularMenus = React.useMemo(() => menuItems.slice(1) as MenuItemWithChildren[], [menuItems])
  
  const [selectedMenu, setSelectedMenu] = React.useState<MenuSwitcherItem | null>(null)
  
  React.useEffect(() => {
    if (menuSwitcher?.menus?.length) {
      setSelectedMenu(menuSwitcher.menus[0])
    }
  }, [menuSwitcher?.menus])

  const handleMenuChange = React.useCallback((menu: MenuSwitcherItem) => {
    setSelectedMenu(menu)
    if (menu.menuList?.length) {
      onMenuChange(menu.menuList[0])
    }
  }, [onMenuChange])

  if (dashboardsLoading || menuLoading) {
    return <div>Loading...</div>
  }

  if (dashboardsError || menuError) {
    return <div>Error: {dashboardsError || menuError}</div>
  }

  return (
    <Sidebar collapsible="icon" {...sidebarProps}>
      <SidebarHeader>
        <DashboardSwitcher
          dashboards={dashboards || []}
          onDashboardChange={onDashboardChange}
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