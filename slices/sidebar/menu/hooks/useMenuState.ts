import { useState, useMemo } from 'react';
import { MenuItem, NavMainData } from '@/slices/sidebar/menu/types/';
import { buildMenuTree } from '../utils/menu-tree';

export function useMenuState() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDashboardId, setCurrentDashboardId] = useState<string | null>(null);
  const [navData, setNavData] = useState<NavMainData | null>(null);

  const menuTree = useMemo(() => {
    if (!menuItems.length) return [];
    return buildMenuTree(menuItems);
  }, [menuItems]);

  return {
    menuItems,
    setMenuItems,
    menuTree,
    loading,
    setLoading,
    error,
    setError,
    currentDashboardId,
    setCurrentDashboardId,
    navData: navData ?? {}, // Update navData to handle null values
    setNavData,
  };
}
