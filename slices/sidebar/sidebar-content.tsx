"use client"

import React, { useEffect, useCallback, useMemo } from 'react'
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
import { MenuItemWithChildren, MenuSwitcherItem, MenuItem } from '@/shared/types/navigation-types'
import { Dashboard } from './dashboard/types'

interface SidebarContentProps {
  type: 'default' | 'menuSwitcher'
  menuItems: MenuItem[]
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

  // Group menu items by parent
  const groupedMenuItems = useMemo(() => {
    const items = type === 'menuSwitcher' ? menuItems : contextMenuItems;
    
    // Map items to ensure they have all required properties
    const mappedItems = items.map(item => ({
      id: item.id,
      name: item.name || '',
      icon: item.icon,
      path: item.url?.href || '#',
      order: item.order || 0,
      parentId: item.parentId,
      children: [] as MenuItem[]
    }));

    // Create a map for quick lookup
    const itemMap = new Map(mappedItems.map(item => [item.id, item]));

    // Group children under their parents
    mappedItems.forEach(item => {
      if (item.parentId && itemMap.has(item.parentId)) {
        const parent = itemMap.get(item.parentId)!;
        parent.children.push(item);
      }
    });

    // Get root items and sort them by order
    const rootItems = mappedItems
      .filter(item => !item.parentId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    console.log('[SidebarContent] Grouped menu items:', rootItems);
    return rootItems;
  }, [type, menuItems, contextMenuItems]);

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
              name: 'Menu',
              menus: menuItems as MenuSwitcherItem[]
            }}
            onMenuChange={handleMenuChange}
          />
        ) : (
          <SidebarMenu>
            {groupedMenuItems.map(item => (
              <SidebarGroup key={item.id}>
                <SidebarGroupComponent
                  group={{
                    label: {
                      id: item.id,
                      name: item.name,
                      icon: item.icon
                    },
                    items: item.children.map(child => ({
                      id: child.id,
                      name: child.name,
                      icon: child.icon,
                      path: child.url?.href || '#',
                      order: child.order || 0
                    })).sort((a, b) => a.order - b.order)
                  }}
                  onEditItem={handleMenuChange}
                  renderIcon={renderIcon}
                />
              </SidebarGroup>
            ))}
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