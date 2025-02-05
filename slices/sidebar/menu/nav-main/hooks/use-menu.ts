import { useState } from 'react';
import { useMenuItems } from './items/use-menu-items';
import { useMenuState } from './state/use-menu-state';
import { MenuItem } from '@/slices/sidebar/menu/types/';

export function useMenu() {
  const { menuItems } = useMenuItems();
  const { navData, updateMenuItem } = useMenuState();
  const [currentDashboardId, setCurrentDashboardId] = useState<string>('main');

  return {
    menuItems,
    currentDashboardId,
    setCurrentDashboardId,
    updateMenuItem,
    navData
  };
}
