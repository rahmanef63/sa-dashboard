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
import { MenuSwitcher } from '@/slices/sidebar/menu/nav-main/menu-switcher/menu-switcher'
import { useSidebar } from '@/shared/hooks/useSidebar'
import { useUser } from '@/shared/hooks/use-user'
import { useDashboard } from './dashboard/hooks/use-dashboard'
import { useMenu } from './menu/types/MenuContextStore'
import { 
  MenuItem,
  SubMenuItem,
  MenuSwitcherItem,
  GroupLabel,
  NavMainData
} from './menu/types/menu-items'
import { NavMain } from './menu/nav-main/nav-main'

interface SidebarContentProps {
  type: 'default' | 'menuSwitcher'
  menuItems: MenuItem[]
  isOpen?: boolean
  onDashboardChange: (dashboard: any) => void
  onMenuChange: (menu: MenuItem) => void
  onFocus?: () => void
  renderIcon: (icon: string | undefined) => JSX.Element | null
  className?: string
  sidebarProps?: React.ComponentProps<typeof Sidebar>
}

interface MenuSwitcherProps {
  items: MenuSwitcherItem[];
  onSelect: (item: MenuSwitcherItem) => void;
}

interface MenuTreeProps {
  items: MenuItem[];
  onSelect: (item: MenuItem) => void;
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
  const { navData, updateNavData } = useMenu();

  useEffect(() => {
    if (currentDashboard?.id) {
      console.log('[SidebarContent] Current dashboard changed:', currentDashboard.id);
      const newNavData: NavMainData = {
        groups: []
      };
      updateNavData(newNavData);
    }
  }, [currentDashboard?.id, updateNavData]);

  const handleDashboardChange = useCallback((dashboard: any) => {
    console.log('[SidebarContent] Dashboard changed:', dashboard);
    onDashboardChange(dashboard);
    selectDashboard(dashboard);
  }, [onDashboardChange, selectDashboard]);

  const handleMenuChange = useCallback((menu: MenuItem) => {
    console.log('[SidebarContent] Menu changed:', menu);
    onMenuChange(menu);
  }, [onMenuChange]);

  const handleMenuSelect = (item: MenuItem) => {
    console.log('[SidebarContent] Menu item selected:', item);
  };

  const handleMenuSwitcherSelect = (item: MenuSwitcherItem) => {
    console.log('[SidebarContent] Menu switcher item selected:', item);
  };

  // Convert menu items to tree structure
  const convertToTree = (items: MenuItem[]): MenuItem[] => {
    const itemMap = new Map<string, MenuItem>();
    const rootItems: MenuItem[] = [];

    // First pass: Create all nodes
    items.forEach((item: MenuItem) => {
      itemMap.set(item.id, {
        ...item,
        children: [],
        groupId: item.groupId
      });
    });

    // Second pass: Build the tree
    items.forEach((item: MenuItem) => {
      if (item.parentId) {
        const parent = itemMap.get(item.parentId);
        if (parent && parent.children) {
          const child: SubMenuItem = {
            ...item,
            parentId: item.parentId,
            path: item.path || '',
            children: []
          };
          parent.children.push(child);
        }
      } else {
        const rootItem = itemMap.get(item.id);
        if (rootItem) {
          rootItems.push(rootItem);
        }
      }
    });

    return rootItems;
  };

  // Sort menu items by order
  const sortMenuItems = (a: MenuItem, b: MenuItem): number => {
    const orderA = a.orderIndex ?? 0;
    const orderB = b.orderIndex ?? 0;
    return orderA - orderB;
  };

  // Group menu items
  const groupMenuItems = (items: MenuItem[]): { [key: string]: MenuItem[] } => {
    return items.reduce((groups: { [key: string]: MenuItem[] }, item: MenuItem) => {
      const groupId = item.groupId || 'default';
      if (!groups[groupId]) {
        groups[groupId] = [];
      }
      groups[groupId].push(item);
      return groups;
    }, {});
  };

  // Convert flat menu items to hierarchical structure
  const menuTree = useMemo(() => {
    if (!navData?.groups) return [];
    const allItems = navData.groups.flatMap(group => group.items);
    return convertToTree(allItems.sort(sortMenuItems));
  }, [navData?.groups]);

  // Group menu items by parent
  const groupedMenuItems = useMemo(() => {
    const items = type === 'menuSwitcher' ? menuItems : 
      navData?.groups ? navData.groups.flatMap(group => group.items) : [];
    
    // Map items to ensure they have all required properties
    const mappedItems: MenuItem[] = items.map((item: MenuItem) => ({
      ...item,
      id: item.id,
      name: item.name || '',
      icon: item.icon,
      path: item.url?.href || '#',
      orderIndex: item.orderIndex || 0,
      parentId: item.parentId,
      groupId: item.groupId,
      children: []
    }));

    // Create a map for quick lookup
    const itemMap = new Map(mappedItems.map(item => [item.id, { ...item, children: [] as MenuItem[] }]));

    // Group children under their parents
    mappedItems.forEach((item: MenuItem) => {
      if (item.parentId && itemMap.has(item.parentId)) {
        const parent = itemMap.get(item.parentId);
        if (parent && parent.children) {
          parent.children.push(item);
        }
      }
    });

    // Get root items and sort them by order
    const rootItems = mappedItems
      .filter((item: MenuItem) => !item.parentId)
      .sort((a: MenuItem, b: MenuItem) => (a.orderIndex || 0) - (b.orderIndex || 0));

    console.log('[SidebarContent] Grouped menu items:', rootItems);
    return rootItems;
  }, [type, menuItems, navData?.groups]);

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
            items={groupedMenuItems}
            onSelect={handleMenuSwitcherSelect}
          />
        ) : (
          <NavMain />
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          userId={userId}
          userName={userName}
          userEmail={userEmail}
          avatar={avatar}
          role={role}
        />
      </SidebarFooter>
    </Sidebar>
  );
}