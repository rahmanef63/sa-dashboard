// /slices/dashboard/api/dashboardService.ts
import { DashboardFormValues, Dashboard } from '../types';

export class DashboardService {
  private static instance: DashboardService;
  private readonly API_BASE = '/api/sidebar/dashboards';
  private cache: Map<string, { data: Dashboard[]; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    // Private constructor to enforce singleton
  }

  static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.CACHE_TTL;
  }

  async getUserDashboards(userId: string): Promise<Dashboard[]> {
    return this.getDashboards(userId);
  }

  async getAllDashboards(): Promise<Dashboard[]> {
    return this.getDashboards();
  }

  private async getDashboards(userId?: string): Promise<Dashboard[]> {
    const cacheKey = userId || 'all';
    
    // Return cached data if valid
    if (this.isCacheValid(cacheKey)) {
      console.log('[DashboardService] Using cached data for:', cacheKey);
      const cached = this.cache.get(cacheKey)!;
      return cached.data;
    }

    console.log('[DashboardService] Fetching fresh data for:', cacheKey);
    const url = userId ? `${this.API_BASE}?userId=${userId}` : this.API_BASE;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { success, data, error } = await response.json();
    if (!success) {
      throw new Error(error || 'Failed to fetch dashboards');
    }

    // Cache the result
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });

    return data;
  }

  async createDashboard(data: DashboardFormValues): Promise<Dashboard> {
    const response = await fetch(this.API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to create dashboard');
    }

    // Invalidate cache after creation
    this.cache.clear();
    return result.data;
  }

  async updateDashboard(id: string, data: Partial<DashboardFormValues>): Promise<Dashboard> {
    const response = await fetch(`${this.API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to update dashboard');
    }

    // Invalidate cache after update
    this.cache.clear();
    return result.data;
  }

  async deleteDashboard(id: string): Promise<void> {
    const response = await fetch(`${this.API_BASE}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete dashboard');
    }

    // Invalidate cache after deletion
    this.cache.clear();
  }

  clearCache(): void {
    this.cache.clear();
  }
}

// Export a singleton instance
export const dashboardService = DashboardService.getInstance();
