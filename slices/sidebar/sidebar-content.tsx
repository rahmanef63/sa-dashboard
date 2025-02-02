"use client"

import React, { useEffect, useCallback } from 'react'
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
  className,
  sidebarProps,
}: SidebarContentProps) {
  const { userId, userName, userEmail, avatar, role } = useUser();
  const { dashboards: availableDashboards, currentDashboard, selectDashboard } = useDashboard();
  const { menuItems: contextMenuItems, setCurrentDashboardId, fetchMenu } = useMenuContext();

  useEffect(() => {
    if (currentDashboard?.id) {
      console.log('[SidebarContent] Current dashboard changed:', currentDashboard.id);
      setCurrentDashboardId(currentDashboard.id);
      fetchMenu(currentDashboard.id);
    }
  }, [currentDashboard?.id, setCurrentDashboardId, fetchMenu]);

  const handleDashboardChange = useCallback((dashboard: Dashboard) => {
    console.log('[SidebarContent] Dashboard changed:', dashboard);
    onDashboardChange(dashboard);
    selectDashboard(dashboard);
  }, [onDashboardChange, selectDashboard]);

  const handleMenuChange = useCallback((menu: MenuItemWithChildren) => {
    console.log('[SidebarContent] Menu changed:', menu);
    onMenuChange(menu);
  }, [onMenuChange]);

  // Use contextMenuItems instead of prop menuItems for rendering
  const menuItemsToRender = type === 'menuSwitcher' ? menuItems : contextMenuItems;
  console.log('[SidebarContent] Menu items to render:', menuItemsToRender);

  return (
    <Sidebar
      {...sidebarProps}
      className={className}
    >
      <SidebarHeader>
        <DashboardSwitcher
          dashboards={availableDashboards}
          defaultDashboardId={currentDashboard?.id}
          onDashboardChange={handleDashboardChange}
        />
      </SidebarHeader>

      <SidebarContent>
        {type === 'menuSwitcher' ? (
          <MenuSwitcher
            menuSwitcher={{
              id: 'menu-switcher',
              title: 'Menu',
              menus: menuItemsToRender as MenuSwitcherItem[]
            }}
            onMenuChange={handleMenuChange}
          />
        ) : (
          <SidebarMenu>
            <SidebarGroup>
              <SidebarGroupComponent
                group={{
                  label: {
                    id: 'main-menu',
                    title: 'Main Menu',
                    icon: 'menu'
                  },
                  items: menuItemsToRender as MenuItemWithChildren[]
                }}
                onEditItem={handleMenuChange}
              />
            </SidebarGroup>
          </SidebarMenu>
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            id: userId || 'default',
            name: userName || '',
            email: userEmail || '',
            avatar: avatar,
            role: role || 'user'
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}