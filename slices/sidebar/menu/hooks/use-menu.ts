// slices/sidebar/menu/hooks/use-menu.ts
import { useState, useCallback } from 'react';
import { MenuItem } from '@/shared/types/navigation-types';
import { menuService } from '@/app/api/sidebar/menu/service';

export function useMenu() {
  // Fixed hook count (4 useState)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDashboardId, setCurrentDashboardId] = useState<string>('main');

  // Stable fetch function with no dependencies
  const fetchMenu = useCallback(async (dashboardId?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = dashboardId 
        ? await menuService.getMenuItems(dashboardId)
        : [];
        
      setMenuItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Menu load failed");
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since all state setters are stable

  return {
    menuItems,
    loading,
    error,
    currentDashboardId,
    setCurrentDashboardId,
    fetchMenu // Expose fetch method for external control
  };
}