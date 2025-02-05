import { useCallback } from 'react';
import { MenuItem } from '@/slices/sidebar/menu/types/';
import { menuService } from '@/app/api/sidebar/menu/service';
import { MenuCache } from '../services/menu-cache';

interface UseMenuFetchProps {
  setMenuItems: (items: MenuItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  cache: MenuCache;
}

export function useMenuFetch({
  setMenuItems,
  setLoading,
  setError,
  cache,
}: UseMenuFetchProps) {
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
      
      cache.setItems(dashboardId, data);
      setMenuItems(data);
    } catch (err) {
      console.error('[useMenu] Error fetching menu:', err);
      setError(err instanceof Error ? err.message : "Menu load failed");
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  }, [cache, setMenuItems, setLoading, setError]);

  return { fetchMenu };
}
