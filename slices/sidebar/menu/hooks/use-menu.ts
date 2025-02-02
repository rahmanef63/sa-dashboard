// slices/sidebar/menu/hooks/use-menu.ts
import { useState, useCallback, useEffect } from 'react';
import { MenuItem } from '@/shared/types/navigation-types';
import { menuService } from '@/app/api/sidebar/menu/service';

// Cache for menu items
const menuCache = new Map<string, MenuItem[]>();

export function useMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDashboardId, setCurrentDashboardId] = useState<string | null>(null);

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
      if (menuCache.has(dashboardId)) {
        console.log('[useMenu] Using cached menu items for dashboard:', dashboardId);
        setMenuItems(menuCache.get(dashboardId)!);
        setLoading(false);
        return;
      }

      console.log('[useMenu] Fetching menu items for dashboard:', dashboardId);
      const data = await menuService.getMenuItems(dashboardId);
      console.log('[useMenu] Fetched menu items:', data);
      
      // Update cache and state
      menuCache.set(dashboardId, data);
      setMenuItems(data);
    } catch (err) {
      console.error('[useMenu] Error fetching menu:', err);
      setError(err instanceof Error ? err.message : "Menu load failed");
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since all state setters are stable

  // Fetch menu items when dashboard ID changes
  useEffect(() => {
    if (currentDashboardId) {
      console.log('[useMenu] Current dashboard ID changed:', currentDashboardId);
      fetchMenu(currentDashboardId);
    }
  }, [currentDashboardId, fetchMenu]);

  return {
    menuItems,
    loading,
    error,
    currentDashboardId,
    setCurrentDashboardId,
    fetchMenu
  };
}