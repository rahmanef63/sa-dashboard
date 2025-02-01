import { 
  Dashboard, 
  DashboardFormValues, 
  DashboardCreateInput, 
  DashboardUpdateInput 
} from '@/slices/sidebar/dashboard/types/index';

class DashboardError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.name = 'DashboardError';
  }
}

export class DashboardService {
  private static readonly API_BASE = '/api/sidebar/dashboards';

  static async getDashboards(userId?: string | null) {
    try {
      const params = userId ? `?userId=${userId}` : '';
      const response = await fetch(`${this.API_BASE}${params}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new DashboardError(error.error || 'Failed to fetch dashboards', response.status);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching dashboards:', error);
      throw error;
    }
  }

  static async createDashboard(input: DashboardCreateInput) {
    try {
      const response = await fetch(this.API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new DashboardError(error.error || 'Failed to create dashboard', response.status);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating dashboard:', error);
      throw error;
    }
  }

  static async updateDashboard(id: string, input: DashboardUpdateInput) {
    try {
      const response = await fetch(this.API_BASE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new DashboardError(error.error || 'Failed to update dashboard', response.status);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating dashboard:', error);
      throw error;
    }
  }

  static async deleteDashboard(id: string) {
    try {
      const response = await fetch(`${this.API_BASE}?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new DashboardError(error.error || 'Failed to delete dashboard', response.status);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error deleting dashboard:', error);
      throw error;
    }
  }
}

// Client-side API functions
export async function fetchDashboards(userId?: string): Promise<Dashboard[]> {
  try {
    const params = userId ? `?userId=${userId}` : '';
    const response = await fetch(`/api/dashboards${params}`);
    const result = await response.json();
    
    if (!response.ok) {
      throw new DashboardError(
        result.error || 'Failed to fetch dashboards',
        response.status
      );
    }
    
    if (!result.success) {
      throw new DashboardError(result.error || 'Failed to fetch dashboards');
    }
    
    return result.data;
  } catch (error) {
    console.error('[Dashboard Service] Fetch Error:', error);
    throw error instanceof DashboardError ? error : new DashboardError(
      error instanceof Error ? error.message : 'Failed to fetch dashboards'
    );
  }
}

export async function createDashboard(data: DashboardFormValues): Promise<Dashboard> {
  try {
    const response = await fetch('/api/dashboards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        id: crypto.randomUUID(),
        isPublic: data.isPublic // This will be converted to is_public in the API
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new DashboardError(
        result.error || `Failed to create dashboard: ${response.statusText}`,
        response.status
      );
    }

    if (!result.success) {
      throw new DashboardError(result.error || 'Failed to create dashboard');
    }

    // Convert is_public back to isPublic in the response
    const dashboard = result.data;
    return {
      ...dashboard,
      isPublic: dashboard.is_public,
    };
  } catch (error) {
    console.error('[Dashboard Service] Create Error:', error);
    throw error instanceof DashboardError ? error : new DashboardError(
      error instanceof Error ? error.message : 'Failed to create dashboard'
    );
  }
}

export async function updateDashboard(id: string, data: Partial<DashboardFormValues>): Promise<Dashboard> {
  try {
    const response = await fetch(`/api/dashboards/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        ...data,
        isPublic: data.isPublic // This will be converted to is_public in the API
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new DashboardError(
        result.error || `Failed to update dashboard: ${response.statusText}`,
        response.status
      );
    }

    if (!result.success) {
      throw new DashboardError(result.error || 'Failed to update dashboard');
    }

    // Convert is_public back to isPublic in the response
    const dashboard = result.data;
    return {
      ...dashboard,
      isPublic: dashboard.is_public,
    };
  } catch (error) {
    console.error('[Dashboard Service] Update Error:', error);
    throw error instanceof DashboardError ? error : new DashboardError(
      error instanceof Error ? error.message : 'Failed to update dashboard'
    );
  }
}

export async function deleteDashboard(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/dashboards/${id}`, {
      method: 'DELETE'
    });

    const result = await response.json();

    if (!response.ok) {
      throw new DashboardError(
        result.error || `Failed to delete dashboard: ${response.statusText}`,
        response.status
      );
    }

    if (!result.success) {
      throw new DashboardError(result.error || 'Failed to delete dashboard');
    }
  } catch (error) {
    console.error('[Dashboard Service] Delete Error:', error);
    throw error instanceof DashboardError ? error : new DashboardError(
      error instanceof Error ? error.message : 'Failed to delete dashboard'
    );
  }
}
