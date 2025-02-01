// /slices/dashboard/api/dashboardService.ts
import { DashboardFormValues, Dashboard } from '../types';

export class DashboardService {
  private static readonly API_BASE = '/api/sidebar/dashboards';

  static async getDashboards(userId?: string): Promise<Dashboard[]> {
    const url = userId ? `${DashboardService.API_BASE}?userId=${userId}` : DashboardService.API_BASE;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch dashboards');
    }
    const { data } = await response.json();
    return data;
  }

  static async createDashboard(data: DashboardFormValues): Promise<Dashboard> {
    const response = await fetch(DashboardService.API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        logo: data.logo,
        plan: data.plan,
        isPublic: data.isPublic,
        userId: data.userId,
        userName: data.userName,
        userEmail: data.userEmail,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create dashboard');
    }

    const { data: dashboard } = await response.json();
    return dashboard;
  }

  static async updateDashboard(id: string, data: Partial<DashboardFormValues>): Promise<Dashboard> {
    const response = await fetch(`${DashboardService.API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        logo: data.logo,
        plan: data.plan,
        isPublic: data.isPublic,
        userId: data.userId,
        userName: data.userName,
        userEmail: data.userEmail,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update dashboard');
    }

    const { data: dashboard } = await response.json();
    return dashboard;
  }

  static async deleteDashboard(id: string): Promise<void> {
    const response = await fetch(`${DashboardService.API_BASE}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete dashboard');
    }
  }
}

// For hooks that expect an instance-style API:
export const dashboardService = {
  getUserDashboards: (userId: string) => DashboardService.getDashboards(userId),
  getAllDashboards: () => DashboardService.getDashboards(),
};
