import { MenuItemWithChildren, MenuItemSchema } from '@/shared/types/navigation-types';

class MenuService {
  async getMenuItems(dashboardId: string): Promise<MenuItemWithChildren[]> {
    try {
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
      
      // Data is already transformed and organized into a tree by the API
      console.log('[Debug] MenuService: Received menu tree with items:', data.length);
      return data;
    } catch (error) {
      console.error('[MenuService] Error fetching menu items:', error);
      throw error;
    }
  }
}

export const menuService = new MenuService();
