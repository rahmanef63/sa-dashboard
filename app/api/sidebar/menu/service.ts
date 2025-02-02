// Menu Service for handling sidebar menu operations
// @/app/api/sidebar/menu/service.ts

import { MenuItem } from '@/shared/types/navigation-types';
import { BaseService } from '../base-service'; // Assuming BaseService is defined in base.service.ts

export class MenuService extends BaseService<MenuItem[]> {
  constructor() {
    super('/api/sidebar/menu');
  }

  async getMenuItems(dashboardId: string): Promise<MenuItem[]> {
    const cacheKey = `menu_${dashboardId}`;
    
    // Check cache first
    const cached = this.getCached(cacheKey);
    if (cached) {
      console.log('[MenuService] Using cached menu items for dashboard:', dashboardId);
      return cached;
    }

    console.log('[MenuService] Fetching menu items for dashboard:', dashboardId);
    try {
      const response = await fetch(`${this.endpoint}?dashboardId=${dashboardId}`, {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const result = await this.handleResponse<MenuItem[]>(response);
      
      // Validate the response is an array
      if (!Array.isArray(result)) {
        console.error('[MenuService] Invalid response - not an array:', result);
        return []; // Return empty array instead of throwing
      }

      // Ensure each item has a children array
      const menuItems = result.map(item => ({
        ...item,
        children: item.children || []
      }));

      console.log('[MenuService] Successfully fetched menu items:', menuItems);
      this.setCache(cacheKey, menuItems);
      return menuItems;
    } catch (error) {
      console.error('[MenuService] Error fetching menu items:', error);
      return []; // Return empty array on error
    }
  }

  clearMenuCache(dashboardId: string): void {
    this.clearCache(`menu_${dashboardId}`);
  }
}

export const menuService = new MenuService();
