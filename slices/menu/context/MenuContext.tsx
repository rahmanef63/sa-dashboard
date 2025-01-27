import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { MenuItemWithChildren, GroupLabel, NavGroup } from '@/shared/types/navigation-types';

interface MenuContextType {
  menuItems: MenuItemWithChildren[];
  setMenuItems: (items: MenuItemWithChildren[]) => void;
  fetchMenuItems: (dashboardId: string) => Promise<MenuItemWithChildren[]>;
  updateMenuItem: (item: MenuItemWithChildren) => Promise<void>;
  deleteMenuItem: (itemId: string) => Promise<void>;
  navData: {
    groups: NavGroup[];
  };
  updateNavData: (data: { groups: NavGroup[] }) => void;
  handleChangeGroup: (groupId: string) => void;
  addGroupLabel: (label: GroupLabel) => void;
  updateGroupLabel: (labelId: string, label: GroupLabel) => void;
  deleteGroupLabel: (labelId: string) => void;
  updateItemCollapsible: (itemId: string, isCollapsed: boolean) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItemWithChildren[]>([]);
  const [currentDashboardId, setCurrentDashboardId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to build menu tree
  const buildMenuTree = (items: MenuItemWithChildren[]): MenuItemWithChildren[] => {
    const itemMap = new Map<string, MenuItemWithChildren>();
    const roots: MenuItemWithChildren[] = [];

    // First pass: create map of items
    items.forEach(item => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    // Second pass: build tree structure
    items.forEach(item => {
      const mappedItem = itemMap.get(item.id);
      if (!mappedItem) return;

      if (item.parentId) {
        const parent = itemMap.get(item.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(mappedItem);
        }
      } else {
        roots.push(mappedItem);
      }
    });

    return roots;
  };

  const fetchMenuItems = useCallback(async (dashboardId: string) => {
    try {
      const response = await fetch(`/api/admin/menu?dashboardId=${dashboardId}`);
      const data = await response.json();
      if (data.success) {
        const hierarchicalMenu = buildMenuTree(data.data);
        setMenuItems(hierarchicalMenu);
        setLoading(false);
        return hierarchicalMenu;
      }
      throw new Error(data.message || 'Failed to fetch menu items');
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
  }, []);

  const updateMenuItem = useCallback(async (item: MenuItemWithChildren) => {
    try {
      const response = await fetch('/api/admin/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to update menu item');
      }
      // Refresh menu items after successful update
      const items = await fetchMenuItems(item.dashboardId || 'main');
      setMenuItems(items);
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  }, [fetchMenuItems]);

  const deleteMenuItem = useCallback(async (itemId: string) => {
    try {
      const response = await fetch(`/api/admin/menu?id=${itemId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to delete menu item');
      }
      // Update local state after successful deletion
      setMenuItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    if (currentDashboardId) {
      fetchMenuItems(currentDashboardId);
    }
  }, [currentDashboardId]);

  const value = {
    menuItems,
    setMenuItems,
    fetchMenuItems,
    updateMenuItem,
    deleteMenuItem,
    navData: {
      groups: []
    },
    updateNavData: () => {},
    handleChangeGroup: () => {},
    addGroupLabel: () => {},
    updateGroupLabel: () => {},
    deleteGroupLabel: () => {},
    updateItemCollapsible: () => {}
  };

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}
