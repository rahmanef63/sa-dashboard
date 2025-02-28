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
import { useMenu } from '@/slices/sidebar/menu/nav-main/context/MenuContextStore'
import { 
  MenuItem,
  SubMenuItem,
  MenuSwitcherItem as MenuSwitcherItemType,
  GroupLabel,
  NavMainData
} from './menu/types/menu-items'
import { NavMain } from './menu/nav-main/nav-main'

interface SidebarContentProps {
  type: 'default' | 'menuSwitcher'
  menuItems: MenuItem[]
  onDashboardChange: (dashboard: any) => void
  onMenuChange: (menu: MenuItem) => void
  onFocus?: () => void
  renderIcon: (icon: string | undefined) => JSX.Element | null
  className?: string
  sidebarProps?: React.ComponentProps<typeof Sidebar>
}

interface MenuSwitcherProps {
  items: MenuSwitcherItemType[];
  onSelect: (item: MenuSwitcherItemType) => void;
}

// Default navigation data for initial state
const initialNavData: NavMainData = {
  groups: [],
  items: [],
  subItems: [],
  dashboardId: ''
};

export function SidebarContentWrapper({
  type = 'default',
  menuItems = [],
  onDashboardChange,
  onMenuChange,
  onFocus,
  renderIcon,
  className,
  sidebarProps = {},
}: SidebarContentProps) {
  const { userId, userName, userEmail, avatar, role } = useUser();
  const { dashboards: availableDashboards, currentDashboard, selectDashboard } = useDashboard();
  const { navData, updateNavData } = useMenu();

  useEffect(() => {
    if (currentDashboard?.id) {
      console.log('[SidebarContent] Current dashboard changed:', currentDashboard.id);
      const newNavData: NavMainData = { ...initialNavData, dashboardId: currentDashboard.id.toString() };
      updateNavData(newNavData);
    }
  }, [currentDashboard?.id, updateNavData]);

  // Force refresh of navigation data when dashboard changes
  const forceRefreshKey = useMemo(() => {
    return currentDashboard?.id || 'default';
  }, [currentDashboard?.id]);

  const handleDashboardChange = useCallback((dashboard: any) => {
    console.log('[SidebarContent] Dashboard changed:', dashboard);
    selectDashboard(dashboard);
    onDashboardChange?.(dashboard);
  }, [selectDashboard, onDashboardChange]);

  const userName2 = useMemo(() => {
    return userName || "User";
  }, [userName]);

  // Map menu items to switcher items
  const switcherItems = useMemo(() => {
    return menuItems.map((item) => ({
      id: item.id,
      name: item.name,
      icon: item.icon
    }))
  }, [menuItems]);

  const handleMenuChange = useCallback((item: MenuSwitcherItemType) => {
    // Find the original menu item with this ID
    const menuItem = menuItems.find(mi => mi.id === item.id);
    if (menuItem) {
      onMenuChange?.(menuItem);
    }
  }, [menuItems, onMenuChange]);

  return (
    <Sidebar className={className} onFocus={onFocus} {...sidebarProps}>
      <SidebarHeader>
        <DashboardSwitcher
          dashboards={availableDashboards}
          defaultDashboardId={currentDashboard?.id || ''}
          onDashboardChange={handleDashboardChange}
        />
      </SidebarHeader>
      <SidebarContent>
        {type === 'default' ? (
          <NavMain key={forceRefreshKey} />
        ) : (
          <MenuSwitcher
            items={switcherItems}
            onSelect={handleMenuChange} 
          />
        )}
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

// Helper function to convert flat menu items to a tree structure
export function buildMenuTree(items: MenuItem[]): MenuItem[] {
  if (!items || items.length === 0) {
    return [];
  }

  // Map items by their ID for easy lookup
  const itemMap = new Map<string, MenuItem & { children: MenuItem[] }>();
  const rootItems: MenuItem[] = [];

  // First pass: Create map entries for all items
  items.forEach(item => {
    itemMap.set(item.id, { ...item, children: [] });
  });

  // Second pass: Build the tree
  items.forEach(item => {
    const mappedItem = itemMap.get(item.id);
    if (mappedItem) {
      if (item.parentId && itemMap.has(item.parentId)) {
        // This is a child item, add it to its parent's children
        const parent = itemMap.get(item.parentId);
        if (parent) {
          parent.children.push(mappedItem);
        }
      } else {
        // This is a root item
        rootItems.push(mappedItem);
      }
    }
  });

  return rootItems;
}

// Helper function to group items by their groupId
export function groupItemsByGroupId(groups: any[], items: MenuItem[]) {
  if (!groups || !items) return groups;

  // Create a map of groups by ID for efficiency
  const groupMap = new Map(groups.map(group => [group.id, { ...group, items: [] }]));

  // Assign items to their respective groups
  items.forEach(item => {
    if (item.groupId && groupMap.has(item.groupId)) {
      const group = groupMap.get(item.groupId);
      if (group) {
        group.items.push(item);
      }
    }
  });

  // Convert map back to array and sort groups if needed
  return Array.from(groupMap.values());
}

// Helper function to create a menu tree from flat items
export function createMenuTree(items: MenuItem[]): MenuItem[] {
  // If there are no items, return an empty array
  if (!items || items.length === 0) return [];

  // Map items for quick lookup
  const mappedItems = items.map(item => ({
    ...item,
    children: [] as MenuItem[]
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

  // Return only root items (those without a parent or with a non-existent parent)
  return mappedItems.filter(item => !item.parentId || !itemMap.has(item.parentId));
}