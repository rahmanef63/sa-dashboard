// Menu Service for handling sidebar menu operations
// @/app/api/sidebar/menu/service.ts

import { BaseService } from '@/app/api/sidebar/base-service';
import { MenuItem } from '@/shared/types/navigation-types';

class MenuService extends BaseService<MenuItem[]> {
  private baseUrl: string;

  constructor() {
    super('/api/sidebar/menu');
    this.baseUrl = '/api/sidebar/menu';
  }

  async getMenuItems(dashboardId: string): Promise<MenuItem[]> {
    try {
      console.log('[MenuService] Fetching menu items for dashboard:', dashboardId);
      const response = await fetch(`${this.baseUrl}?dashboardId=${dashboardId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('[MenuService] Raw API response:', data);

      if (!data || !data.data) {
        console.warn('[MenuService] No menu items found');
        return [];
      }

      // Ensure we're returning an array
      const menuItems = Array.isArray(data.data) ? data.data : [];
      console.log('[MenuService] Processed menu items:', menuItems);
      
      return menuItems;
    } catch (error) {
      console.error('[MenuService] Error fetching menu items:', error);
      throw error;
    }
  }

  clearMenuCache(dashboardId: string): void {
    this.clearCache(`menu_${dashboardId}`);
  }
}

export const menuService = new MenuService();
