// Menu Service for handling sidebar menu operations
// @/app/api/sidebar/menu/service.ts

import { MenuItemWithChildren, MenuItemSchema } from '@/shared/types/navigation-types';

class MenuService {
  async getMenuItems(dashboardId: string): Promise<MenuItemWithChildren[]> {
    try {
      console.log('[Debug] MenuService: Fetching items for dashboard:', dashboardId);
      
      // Get auth token from cookie
      const authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('authToken='))
        ?.split('=')[1];

      if (!authToken) {
        throw new Error('Unauthorized - No auth token found');
      }

      const token = decodeURIComponent(authToken);
      
      const response = await fetch(`/api/sidebar/menu?dashboardId=${dashboardId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 401) {
        throw new Error('Unauthorized - Invalid or expired token');
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch menu items: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        console.warn('[Debug] MenuService: Menu items data is not an array:', data);
        return [];
      }
      
      console.log('[Debug] MenuService: Received menu tree with items:', data.length);
      return data;
    } catch (error) {
      console.error('[MenuService] Error fetching menu items:', error);
      throw error;
    }
  }
}

export const menuService = new MenuService();
