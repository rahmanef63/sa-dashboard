// Modification: Updating API calls and modifying data handling.
// /slices/dashboard/api/dashboardService.ts
import { DashboardFormValues, Dashboard } from '@/slices/sidebar/dashboard/types';

export class DashboardService {
  static fetchDashboard(dashboardId: string) {
    throw new Error("Method not implemented.");
  }
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

  private getAuthToken(): string {
    const authToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('authToken='))
      ?.split('=')[1];

    if (!authToken) {
      throw new Error('Unauthorized - No auth token found');
    }

    return decodeURIComponent(authToken);
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
    
    const token = this.getAuthToken();
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      // Clear cache on unauthorized
      this.cache.clear();
      throw new Error('Unauthorized - Invalid or expired token');
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch dashboards: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Cache the successful response
    this.cache.set(cacheKey, { 
      data,
      timestamp: Date.now() 
    });

    return data;
  }

  async createDashboard(data: DashboardFormValues): Promise<Dashboard> {
    const token = this.getAuthToken();
    
    const response = await fetch(this.API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create dashboard: ${response.statusText}`);
    }

    return response.json();
  }

  async updateDashboard(id: string, data: DashboardFormValues): Promise<Dashboard> {
    const token = this.getAuthToken();
    
    const response = await fetch(`${this.API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update dashboard: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteDashboard(id: string): Promise<void> {
    const token = this.getAuthToken();
    
    const response = await fetch(`${this.API_BASE}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to delete dashboard: ${response.statusText}`);
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

// Export a singleton instance
export const dashboardService = DashboardService.getInstance();
