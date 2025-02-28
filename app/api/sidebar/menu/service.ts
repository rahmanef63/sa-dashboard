// Menu Service for handling sidebar menu operations
// @/app/api/sidebar/menu/service.ts

import { BaseService } from '@/app/api/sidebar/base-service';
import { MenuItem } from '@/slices/sidebar/menu/types/';

// Singleton instance to maintain cache across components
let menuCache: Record<string, any> = {};

// Configuration for retry mechanism
const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  INITIAL_DELAY: 300, // ms
  BACKOFF_FACTOR: 1.5, // Exponential backoff
  JITTER: 100, // Random jitter in ms to prevent race conditions
};

// Forward declaration of menuServiceHealth to avoid circular dependency
// We'll dynamically import it when needed to avoid issues
let menuServiceHealth: any = null;

/**
 * Dynamically import the menuServiceHealth module to avoid circular dependencies
 */
async function getMenuServiceHealth() {
  if (!menuServiceHealth) {
    try {
      // Dynamic import to avoid circular dependency
      const { menuServiceHealth: healthInstance } = await import('./monitoring');
      menuServiceHealth = healthInstance;
    } catch (error) {
      console.warn('[MenuService] Could not load monitoring module:', error);
    }
  }
  return menuServiceHealth;
}

class MenuService extends BaseService<MenuItem[]> {
  private baseUrl: string;

  constructor() {
    super('/api/sidebar/menu');
    this.baseUrl = '/api/sidebar/menu';
  }

  /**
   * Get menu items for a specific dashboard with retry mechanism
   * @param dashboardId - Dashboard identifier
   * @returns Promise with menu items array
   */
  async getMenuItems(dashboardId: string): Promise<MenuItem[]> {
    // Check cache first
    if (menuCache[dashboardId]) {
      console.log('[Debug] MenuService: Using cached items for dashboard:', dashboardId);
      return menuCache[dashboardId];
    }

    return this.fetchMenuItemsWithRetry(dashboardId);
  }

  /**
   * Fetch menu items with retry logic
   * Implements exponential backoff with jitter to prevent race conditions
   */
  private async fetchMenuItemsWithRetry(dashboardId: string, retryCount = 0): Promise<MenuItem[]> {
    try {
      console.log(`[MenuService] Fetching menu items for dashboard: ${dashboardId} (Attempt ${retryCount + 1}/${RETRY_CONFIG.MAX_RETRIES + 1})`);
      
      const response = await fetch(`${this.baseUrl}?dashboardId=${dashboardId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Handle HTTP errors
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: errorText };
        }
        
        const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
        console.error(`[MenuService] HTTP error: ${response.status} - ${errorMessage}`);
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      
      // Handle unsuccessful responses
      if (!responseData.success && !Array.isArray(responseData.data)) {
        console.warn('[MenuService] Server returned unsuccessful response:', responseData);
        throw new Error('Failed to fetch menu items: Server returned unsuccessful response');
      }

      // Validate data structure
      if (!Array.isArray(responseData.data)) {
        console.warn('[MenuService] Menu items data is not an array:', responseData.data);
        return [];
      }

      // Cache the response
      menuCache[dashboardId] = responseData.data;
      console.log(`[MenuService] Successfully fetched and cached ${responseData.data.length} menu items for dashboard: ${dashboardId}`);
      
      // If we have monitoring, add this dashboard to the monitoring list
      this.updateHealthMonitoring(dashboardId, true);
      
      return responseData.data;
    } catch (error) {
      console.error(`[MenuService] Error fetching menu items (Attempt ${retryCount + 1}):`, error);
      
      // Update health monitoring on error
      this.updateHealthMonitoring(dashboardId, false);
      
      // Check if we should retry
      if (retryCount < RETRY_CONFIG.MAX_RETRIES) {
        // Calculate backoff delay with jitter to prevent race conditions
        const delay = RETRY_CONFIG.INITIAL_DELAY * Math.pow(RETRY_CONFIG.BACKOFF_FACTOR, retryCount) + 
                      Math.floor(Math.random() * RETRY_CONFIG.JITTER);
        
        console.log(`[MenuService] Retrying after ${delay}ms (Attempt ${retryCount + 1}/${RETRY_CONFIG.MAX_RETRIES})`);
        
        // Wait for the calculated delay
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Retry with incremented counter
        return this.fetchMenuItemsWithRetry(dashboardId, retryCount + 1);
      }
      
      // If we've exhausted retries, throw the error or return empty array
      console.error(`[MenuService] All retry attempts failed for dashboard: ${dashboardId}`);
      
      // Return empty array as fallback instead of throwing to prevent app crashes
      return [];
    }
  }
  
  /**
   * Update health monitoring when menu items are fetched
   * @param dashboardId - Dashboard ID
   * @param success - Whether the fetch was successful
   */
  private async updateHealthMonitoring(dashboardId: string, success: boolean): Promise<void> {
    try {
      const health = await getMenuServiceHealth();
      if (health) {
        // Add dashboard to monitoring
        health.addDashboardToMonitoring(dashboardId);
      }
    } catch (error) {
      console.warn('[MenuService] Error updating health monitoring:', error);
    }
  }

  /**
   * Clear menu cache for a specific dashboard
   */
  clearMenuCache(dashboardId: string): void {
    console.log(`[MenuService] Clearing cache for dashboard: ${dashboardId}`);
    delete menuCache[dashboardId];
  }

  /**
   * Clear all menu cache
   */
  clearAllCache(): void {
    console.log('[MenuService] Clearing all menu cache');
    menuCache = {};
  }
  
  /**
   * Force refresh menu items by clearing cache and fetching fresh data
   */
  async refreshMenuItems(dashboardId: string): Promise<MenuItem[]> {
    console.log(`[MenuService] Force refreshing menu items for dashboard: ${dashboardId}`);
    this.clearMenuCache(dashboardId);
    return this.getMenuItems(dashboardId);
  }
  
  /**
   * Get monitoring health metrics for menu service
   * @returns Promise with health metrics
   */
  async getHealthMetrics(): Promise<Record<string, any>> {
    try {
      const health = await getMenuServiceHealth();
      if (health) {
        return health.getHealthMetrics();
      }
      return { error: 'Health monitoring not available' };
    } catch (error) {
      console.error('[MenuService] Error getting health metrics:', error);
      return { error: 'Failed to get health metrics' };
    }
  }
}

export const menuService = new MenuService();
