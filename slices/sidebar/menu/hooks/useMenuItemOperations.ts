import { useCallback } from 'react';
import { MenuItem, SubMenuItem } from '@/slices/sidebar/menu/types/';
import { MenuCache } from '../services/menu-cache';

interface UseMenuItemOperationsProps {
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  currentDashboardId: string | null;
  cache: MenuCache;
}

export function useMenuItemOperations({
  setMenuItems,
  currentDashboardId,
  cache,
}: UseMenuItemOperationsProps) {
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

  const updateSubMenuItem = useCallback((groupId: string, parentId: string, item: SubMenuItem) => {
    setMenuItems(prev => {
      const newItems = [...prev];
      const parentIndex = newItems.findIndex(i => i.id === parentId);
      if (parentIndex !== -1) {
        const parent = newItems[parentIndex];
        const items = parent.items || [];
        const itemIndex = items.findIndex((subItem: SubMenuItem) => subItem.id === item.id);
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
        const items = parent.items?.filter((subItem: SubMenuItem) => subItem.id !== itemId) || [];
        newItems[parentIndex] = { ...parent, items };
      }
      return newItems;
    });
    if (currentDashboardId) {
      cache.invalidate(currentDashboardId);
    }
  }, [cache, currentDashboardId]);

  return {
    updateMenuItem,
    deleteMenuItem,
    updateSubMenuItem,
    deleteSubMenuItem,
  };
}
