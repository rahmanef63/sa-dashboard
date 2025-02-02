// slices/sidebar/menu/hooks/use-menu.ts
import { useState, useCallback, useEffect, useMemo } from 'react';
import { MenuItem,  NavMainData, SubMenuItem } from '@/shared/types/navigation-types';
import { menuService } from '@/app/api/sidebar/menu/service';
import { MenuCache } from '../services/menu-cache';
import { buildMenuTree } from '../utils/menu-tree';

export function useMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDashboardId, setCurrentDashboardId] = useState<string | null>(null);
  const [navData, setNavData] = useState<NavMainData | null>(null);

  const cache = useMemo(() => MenuCache.getInstance(), []);

  // Memoized menu tree
  const menuTree = useMemo(() => {
    if (!menuItems.length) return [];
    return buildMenuTree(menuItems);
  }, [menuItems]);

  // Fetch menu items with caching
  const fetchMenu = useCallback(async (dashboardId?: string) => {
    if (!dashboardId) {
      console.log('[useMenu] No dashboard ID provided');
      setMenuItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Check cache first
      const cachedItems = cache.getItems(dashboardId);
      if (cachedItems) {
        console.log('[useMenu] Using cached menu items for dashboard:', dashboardId);
        setMenuItems(cachedItems);
        setLoading(false);
        return;
      }

      console.log('[useMenu] Fetching menu items for dashboard:', dashboardId);
      const data = await menuService.getMenuItems(dashboardId);
      console.log('[useMenu] Fetched menu items:', data);
      
      // Update cache and state
      cache.setItems(dashboardId, data);
      setMenuItems(data);
    } catch (err) {
      console.error('[useMenu] Error fetching menu:', err);
      setError(err instanceof Error ? err.message : "Menu load failed");
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  }, [cache]);

  // Update menu items when dashboard changes
  useEffect(() => {
    if (currentDashboardId) {
      fetchMenu(currentDashboardId);
    }
  }, [currentDashboardId, fetchMenu]);

  const updateMenuItem = useCallback((item: MenuItem) => {
    setMenuItems(prev => prev.map(i => i.id === item.id ? item : i));
    if (currentDashboardId) {
      cache.invalidate(currentDashboardId);
    }
  }, [cache, currentDashboardId]);

  const deleteMenuItem = useCallback((itemId: string) => {
    setMenuItems(prev => prev.filter(i => i.id !== itemId));
    if (currentDashboardId) {
      cache.invalidate(currentDashboardId);
    }
  }, [cache, currentDashboardId]);

  const updateNavData = useCallback((data: NavMainData) => {
    setNavData(data);
  }, []);

  const updateSubMenuItem = useCallback((groupId: string, parentId: string, item: SubMenuItem) => {
    setMenuItems(prev => {
      const newItems = [...prev];
      const parentIndex = newItems.findIndex(i => i.id === parentId);
      if (parentIndex !== -1) {
        const parent = newItems[parentIndex];
        const items = parent.items || [];
        const itemIndex = items.findIndex(i => i.id === item.id);
        if (itemIndex !== -1) {
          items[itemIndex] = item;
        } else {
          items.push(item);
        }
        newItems[parentIndex] = { ...parent, items };
      }
      return newItems;
    });
    if (currentDashboardId) {
      cache.invalidate(currentDashboardId);
    }
  }, [cache, currentDashboardId]);

  const deleteSubMenuItem = useCallback((groupId: string, parentId: string, itemId: string) => {
    setMenuItems(prev => {
      const newItems = [...prev];
      const parentIndex = newItems.findIndex(i => i.id === parentId);
      if (parentIndex !== -1) {
        const parent = newItems[parentIndex];
        const items = parent.items?.filter(i => i.id !== itemId) || [];
        newItems[parentIndex] = { ...parent, items };
      }
      return newItems;
    });
    if (currentDashboardId) {
      cache.invalidate(currentDashboardId);
    }
  }, [cache, currentDashboardId]);

  return {
    menuItems,
    menuTree,
    loading,
    error,
    navData,
    currentDashboardId,
    setCurrentDashboardId,
    fetchMenu,
    updateMenuItem,
    deleteMenuItem,
    updateNavData,
    updateSubMenuItem,
    deleteSubMenuItem,
  };
}