import { Dashboard } from '../types/dashboard.types';

class DashboardService {
  private baseUrl = '/api/dashboards';

  async getUserDashboards(userId: string): Promise<Dashboard[]> {
    try {
      const response = await fetch(`${this.baseUrl}?userId=${userId}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch dashboards');
      }

      return data.data;
    } catch (error) {
      console.error('[DashboardService] getUserDashboards Error:', error);
      throw error;
    }
  }

  async getAllDashboards(): Promise<Dashboard[]> {
    try {
      const response = await fetch(this.baseUrl);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch dashboards');
      }

      return data.data;
    } catch (error) {
      console.error('[DashboardService] getAllDashboards Error:', error);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();
