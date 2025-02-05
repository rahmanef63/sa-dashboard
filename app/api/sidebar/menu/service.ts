// Menu Service for handling sidebar menu operations
// @/app/api/sidebar/menu/service.ts

import { BaseService } from '@/app/api/sidebar/base-service';
import { MenuItem } from '@/slices/sidebar/menu/types/';

// Singleton instance to maintain cache across components
let menuCache: Record<string, any> = {};

class MenuService extends BaseService<MenuItem[]> {
  private baseUrl: string;

  constructor() {
    super('/api/sidebar/menu');
    this.baseUrl = '/api/sidebar/menu';
  }

  async getMenuItems(dashboardId: string): Promise<MenuItem[]> {
    try {
      // Check cache first
      if (menuCache[dashboardId]) {
        console.log('[Debug] MenuService: Using cached items for dashboard:', dashboardId);
        return menuCache[dashboardId];
      }

      console.log('[MenuService] Fetching menu items for dashboard:', dashboardId);
      const response = await fetch(`${this.baseUrl}?dashboardId=${dashboardId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
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

  clearMenuCache(dashboardId: string): void {
    delete menuCache[dashboardId];
  }

  clearAllCache(): void {
    menuCache = {};
  }
}

export const menuService = new MenuService();
