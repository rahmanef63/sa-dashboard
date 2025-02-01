import { useEffect, useState, useCallback } from 'react';
import { MenuItem } from '@/shared/types/navigation-types';
import { menuService } from '../api/menuService';

export function useMenu(dashboardId: string | undefined) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuItems = useCallback(async () => {
    if (!dashboardId) {
      console.log('[Debug] No dashboard ID, clearing menu items');
      setMenuItems([]);
      setLoading(false);
      return;
    }

    try {
      console.log('[Debug] Fetching menu items for dashboard:', dashboardId);
      setLoading(true);
      setError(null);
      const data = await menuService.getMenuItems(dashboardId);
      console.log('[Debug] Setting menu items:', data);
      setMenuItems(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch menu items';
      console.error('[useMenu] Error:', errorMessage);
      setError(errorMessage);
      // Clear menu items on error to prevent stale data
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  }, [dashboardId]);

  // Fetch menu items when dashboard changes
  useEffect(() => {
    console.log('[Debug] Dashboard ID changed:', dashboardId);
    fetchMenuItems();
  }, [dashboardId, fetchMenuItems]);

  return { 
    menuItems, 
    loading, 
    error,
    refetch: fetchMenuItems 
  };
}
