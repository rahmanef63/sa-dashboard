"use client"

import { createContext, useContext, useMemo } from 'react';
import { useMenu } from '../hooks/use-menu';
import type { MenuItem, MenuItemWithChildren, MenuContextType, NavMainData, SubMenuItem } from '@/shared/types/navigation-types';

interface MenuContextValue extends MenuContextType {
  menuItems: MenuItem[];
  menuTree: MenuItemWithChildren[];
  loading: boolean;
  error: string | null;
  currentDashboardId: string | null;
  setCurrentDashboardId: (id: string | null) => void;
  fetchMenu: (dashboardId?: string) => Promise<void>;
}

const MenuContext = createContext<MenuContextValue>({
  menuItems: [],
  menuTree: [],
  loading: false,
  error: null,
  navData: null,
  currentDashboardId: null,
  setCurrentDashboardId: () => {},
  fetchMenu: async () => {},
  updateMenuItem: () => {},
  deleteMenuItem: () => {},
  updateNavData: () => {},
  updateSubMenuItem: () => {},
  deleteSubMenuItem: () => {}
});

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const menu = useMenu();
  
  const value = useMemo<MenuContextValue>(() => ({
    ...menu
  }), [menu]);

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenuContext must be used within a MenuProvider');
  }
  return context;
};
