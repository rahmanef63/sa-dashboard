"use client"

import { createContext, useContext, useMemo, useState } from 'react';
import type { MenuItem, MenuContextType, NavMainData, SubMenuItem, MenuGroup, MenuContextData } from '@/slices/sidebar/menu/types/';

interface MenuContextValue extends Omit<MenuContextType, 'error'> {
  menuItems: MenuItem[];
  menuTree: MenuItem[];
  loading: boolean;
  error: Error | null;
  navData: NavMainData | null;
  currentDashboardId: string | null;
  setCurrentDashboardId: (id: string | null) => void;
  fetchMenu: (dashboardId?: string) => Promise<void>;
  groups: MenuGroup[];
  items: MenuItem[];
  subItems: SubMenuItem[];
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  addGroup: (group: MenuGroup) => void;
  updateGroup: (group: MenuGroup) => void;
  deleteGroup: (groupId: string) => void;
  addItem: (item: MenuItem) => void;
  updateItem: (item: MenuItem) => void;
  deleteItem: (itemId: string) => void;
  addSubItem: (item: SubMenuItem) => void;
  updateSubItem: (item: SubMenuItem) => void;
  deleteSubItem: (itemId: string) => void;
  setMenuItems: (items: MenuItem[] | ((prev: MenuItem[]) => MenuItem[])) => void;
  updateSubMenuItem: (groupId: string, parentId: string, subItem: SubMenuItem) => void;
  deleteSubMenuItem: (groupId: string, parentId: string, subItemId: string) => void;
  updateItemCollapsible: (itemId: string, isCollapsible: boolean) => void;
  handleChangeGroup: (itemId: string, newGroupId: string) => void;
}

const MenuContext = createContext<MenuContextValue>({
  menuItems: [],
  menuTree: [],
  loading: false,
  error: null,
  navData: null,
  currentDashboardId: null,
  groups: [],
  items: [],
  subItems: [],
  isLoading: false,
  setCurrentDashboardId: () => {},
  setLoading: () => {},
  setError: () => {},
  fetchMenu: async () => {},
  addGroup: () => {},
  updateGroup: () => {},
  deleteGroup: () => {},
  addItem: () => {},
  updateItem: () => {},
  deleteItem: () => {},
  addSubItem: () => {},
  updateSubItem: () => {},
  deleteSubItem: () => {},
  setMenuItems: () => {},
  updateSubMenuItem: () => {},
  deleteSubMenuItem: () => {},
  updateItemCollapsible: () => {},
  handleChangeGroup: () => {},
  updateNavData: () => {},
});

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuTree, setMenuTree] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [navData, setNavData] = useState<NavMainData | null>(null);
  const [currentDashboardId, setCurrentDashboardId] = useState<string | null>(null);
  const [groups, setGroups] = useState<MenuGroup[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [subItems, setSubItems] = useState<SubMenuItem[]>([]);

  const fetchMenu = async (dashboardId?: string) => {
    try {
      setLoading(true);
      // TODO: Implement actual API call to fetch menu data
      setMenuItems([]);
      setMenuTree([]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch menu'));
    } finally {
      setLoading(false);
    }
  };

  const addGroup = (group: MenuGroup) => {
    setGroups(prev => [...prev, group]);
  };

  const updateGroup = (group: MenuGroup) => {
    setGroups(prev => prev.map(g => g.id === group.id ? group : g));
  };

  const deleteGroup = (groupId: string) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
  };

  const addItem = (item: MenuItem) => {
    setItems(prev => [...prev, item]);
  };

  const updateItem = (item: MenuItem) => {
    setItems(prev => prev.map(i => i.id === item.id ? item : i));
  };

  const deleteItem = (itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
  };

  const addSubItem = (item: SubMenuItem) => {
    setSubItems(prev => [...prev, item]);
  };

  const updateSubItem = (item: SubMenuItem) => {
    setSubItems(prev => prev.map(i => i.id === item.id ? item : i));
  };

  const deleteSubItem = (itemId: string) => {
    setSubItems(prev => prev.filter(i => i.id !== itemId));
  };

  const updateSubMenuItem = (groupId: string, parentId: string, subItem: SubMenuItem) => {
    setItems(prev => prev.map(item => {
      if (item.groupId === groupId && item.id === parentId && item.items) {
        return {
          ...item,
          items: item.items.map(si => si.id === subItem.id ? subItem : si)
        };
      }
      return item;
    }));
  };

  const deleteSubMenuItem = (groupId: string, parentId: string, subItemId: string) => {
    setItems(prev => prev.map(item => {
      if (item.groupId === groupId && item.id === parentId && item.items) {
        return {
          ...item,
          items: item.items.filter(si => si.id !== subItemId)
        };
      }
      return item;
    }));
  };

  const updateItemCollapsible = (itemId: string, isCollapsible: boolean) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, isCollapsible };
      }
      return item;
    }));
  };

  const handleChangeGroup = (itemId: string, newGroupId: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, groupId: newGroupId };
      }
      return item;
    }));
  };

  const updateNavData = (data: MenuContextData) => {
    const newNavData: NavMainData = {
      dashboardId: currentDashboardId || '',
      groups: data.groups,
      items: data.items,
      subItems: subItems
    };
    setNavData(newNavData);
    setGroups(data.groups);
    setItems(data.items);
  };

  const value = useMemo<MenuContextValue>(() => ({
    menuItems,
    menuTree,
    loading,
    error,
    navData,
    currentDashboardId,
    groups,
    items,
    subItems,
    isLoading: loading,
    setCurrentDashboardId,
    setLoading,
    setError,
    fetchMenu,
    addGroup,
    updateGroup,
    deleteGroup,
    addItem,
    updateItem,
    deleteItem,
    addSubItem,
    updateSubItem,
    deleteSubItem,
    setMenuItems,
    updateSubMenuItem,
    deleteSubMenuItem,
    updateItemCollapsible,
    handleChangeGroup,
    updateNavData,
  }), [menuItems, menuTree, loading, error, navData, currentDashboardId, groups, items, subItems]);

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenuContext must be used within a MenuProvider');
  }
  return context;
};
