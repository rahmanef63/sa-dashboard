"use client"

import { createContext, useContext, useMemo } from 'react';
import { useMenu } from '../hooks/use-menu';
import type { MenuItem } from '@/shared/types/navigation-types';

interface MenuContextValue {
  menuItems: MenuItem[];
  loading: boolean;
  error: string | null;
  currentDashboardId: string;
  setCurrentDashboardId: (id: string) => void;
  fetchMenu: (dashboardId?: string) => Promise<void>;
}

const MenuContext = createContext<MenuContextValue>({} as MenuContextValue);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const menu = useMenu(); // Always called
  
  const value = useMemo(() => ({
    ...menu,
  }), [menu]);

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export const useMenuContext = () => useContext(MenuContext);
