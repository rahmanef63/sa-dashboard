// Modification: Updating API calls and modifying data handling.
// /slices/dashboard/api/dashboardService.ts
import { Dashboard } from '@/slices/sidebar/dashboard/types';
import { BaseService } from '../base-service';
import { API_CONFIG } from '../config';

export class DashboardService extends BaseService<Dashboard[]> {
  private static instance: DashboardService;

  private constructor() {
    super(API_CONFIG.ENDPOINTS.DASHBOARDS);
  }

  static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  async getUserDashboards(userId: string): Promise<Dashboard[]> {
    const cacheKey = `user_${userId}`;
    
    // Check cache first
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    console.log('[Dashboards API] Fetching dashboards for user:', userId);
    try {
      const response = await fetch(`${this.endpoint}?userId=${userId}`, {
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await this.handleResponse<Dashboard[]>(response);
      console.log('[Dashboards API] Raw API response:', result);
      
      // Ensure we're getting an array of dashboards from the data property
      if (!result || !Array.isArray(result)) {
        console.error('[Dashboards API] Invalid response structure:', result);
        throw new Error('Invalid response structure from API');
      }

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('[Dashboards API] Error:', error);
      throw error;
    }
  }

  async getAllDashboards(): Promise<Dashboard[]> {
    const cacheKey = 'all';
    
    // Check cache first
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(this.endpoint, {
        headers: { 'Content-Type': 'application/json' }
      });

      const dashboards = await this.handleResponse<Dashboard[]>(response);
      this.setCache(cacheKey, dashboards);
      return dashboards;
    } catch (error) {
      console.error('[Dashboards API] Error:', error);
      throw error;
    }
  }

  async createDashboard(data: any): Promise<Dashboard> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const dashboard = await this.handleResponse<Dashboard>(response);
    this.clearAllCache();
    return dashboard;
  }

  async updateDashboard(id: string, data: any): Promise<Dashboard> {
    const response = await fetch(`${this.endpoint}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const dashboard = await this.handleResponse<Dashboard>(response);
    this.clearAllCache();
    return dashboard;
  }

  async deleteDashboard(id: string): Promise<void> {
    const response = await fetch(`${this.endpoint}/${id}`, {
      method: 'DELETE'
    });

    await this.handleResponse<void>(response);
    this.clearAllCache();
  }

  clearUserCache(userId: string): void {
    this.clearCache(`user_${userId}`);
  }

  clearAllCache(): void {
    // Clear all dashboard-related caches
    this.cache.clear();
  }
}

// Export a singleton instance
export const dashboardService = DashboardService.getInstance();
