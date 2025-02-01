import { useEffect, useState } from 'react';
import { MenuItem } from '@/shared/types/navigation-types';
import { menuService } from '../api/menuService';

export function useMenu(dashboardId: string | undefined) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMenuItems() {
      if (!dashboardId) {
        setMenuItems([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await menuService.getMenuItems(dashboardId);
        setMenuItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch menu items');
        console.error('[useMenu] Error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMenuItems();
  }, [dashboardId]);

  return { menuItems, loading, error };
}
