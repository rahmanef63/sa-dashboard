"use client"

import React, { useEffect } from 'react'
import { DashboardSwitcher } from "@/slices/sidebar/dashboard/features/switcher/dashboard-switcher"
import { NavUser } from "@/slices/sidebar/menu/nav-user/nav-user"
import { SidebarGroupComponent } from "@/slices/sidebar/menu/nav-main/components/groups/MenuGroup"
import { NavProjects } from "@/slices/sidebar/menu/nav-projects/nav-projects"
import { navProjectsConfig } from "@/slices/sidebar/menu/nav-projects/config"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarSeparator,
} from "@/shared/components/ui/sidebar"
import { MenuSwitcher } from '@/slices/sidebar/menu/menu-switcher/menu-switcher'
import { useSidebar } from '@/shared/hooks/useSidebar'
import { useUser } from '@/shared/hooks/use-user'
import { useDashboard } from './dashboard/hooks/use-dashboard'
import { useMenuContext } from './menu/context/menu-context'
import { MenuItemWithChildren, MenuSwitcherItem } from '@/shared/types/navigation-types'
import { Dashboard } from './dashboard/types'

interface SidebarContentProps {
  type: 'default' | 'menuSwitcher'
  menuItems: MenuSwitcherItem[] | MenuItemWithChildren[]
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
  sidebarProps,
}: SidebarContentProps) {
  const { userId, userName, userEmail, avatar, role } = useUser();
  const { dashboards: availableDashboards, currentDashboard, selectDashboard } = useDashboard();
  const { menuItems: contextMenuItems, setCurrentDashboardId, fetchMenu } = useMenuContext();

  const handleDashboardChange = (dashboard: Dashboard) => {
    selectDashboard(dashboard);
    onDashboardChange(dashboard);
    setCurrentDashboardId(dashboard.id);
  };

  // Transform menu items for SidebarGroupComponent
  const mainGroup = React.useMemo(() => ({
    label: {
      id: 'main-menu',
      title: 'Main Menu',
      icon: 'menu',
      isCollapsible: true
    },
    items: (menuItems as MenuItemWithChildren[]).map(item => ({
      ...item,
      id: item.id || String(Math.random()),
      order: item.orderIndex || 0
    }))
  }), [menuItems]);

  // Update menu when dashboard changes
  React.useEffect(() => {
    if (type !== 'menuSwitcher' && currentDashboard?.id) {
      fetchMenu(currentDashboard.id);
    }
  }, [type, currentDashboard?.id, fetchMenu]);

  return (
    <Sidebar
      {...sidebarProps}
    >
      <SidebarHeader>
        <DashboardSwitcher
          dashboards={availableDashboards}
          onDashboardChange={handleDashboardChange}
          defaultDashboardId={currentDashboard?.id}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {type === 'menuSwitcher' ? (
            <MenuSwitcher
              menuSwitcher={{
                id: 'menu-switcher',
                title: 'Menu Switcher',
                menus: (menuItems as MenuSwitcherItem[]).map(item => ({
                  ...item,
                  menuList: item.menuList || []
                }))
              }}
              onMenuChange={(menu) => onMenuChange(menu as MenuItemWithChildren)}
              className={className}
            />
          ) : (
            <SidebarGroupComponent
              group={mainGroup}
              onEditItem={onMenuChange}
              className={className}
            />
          )}
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <NavProjects {...navProjectsConfig} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser 
          user={{
            id: userId,
            name: userName,
            email: userEmail,
            avatar: avatar,
            role: role
          }} 
        />
      </SidebarFooter>
    </Sidebar>
  );
}