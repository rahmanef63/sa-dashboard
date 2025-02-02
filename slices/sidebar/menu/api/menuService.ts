import { MenuItemWithChildren, MenuItemSchema } from 'shared/types/navigation-types';

// Singleton instance to maintain cache across components
let menuCache: Record<string, any> = {};

export const menuService = {
  clearCache: () => {
    menuCache = {};
  },

  async getMenuItems(dashboardId: string): Promise<MenuItemWithChildren[]> {
    try {
      // Check cache first
      if (menuCache[dashboardId]) {
        console.log('[Debug] MenuService: Using cached items for dashboard:', dashboardId);
        return menuCache[dashboardId];
      }

      console.log('[Debug] MenuService: Fetching items for dashboard:', dashboardId);
      const response = await fetch(`/api/sidebar/menu?dashboardId=${dashboardId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch menu items');
      }

      const { data, success } = await response.json();
      
      if (!success) {
        throw new Error('Failed to fetch menu items: Server returned unsuccessful response');
      }
      
      if (!Array.isArray(data)) {
        console.warn('[Debug] MenuService: Menu items data is not an array:', data);
        return [];
      }
      
      // Cache the response
      menuCache[dashboardId] = data;
      console.log('[Debug] MenuService: Cached menu items for dashboard:', dashboardId);
      return data;
    } catch (error) {
      console.error('[MenuService] Error fetching menu items:', error);
      throw error;
    }
  }
};
