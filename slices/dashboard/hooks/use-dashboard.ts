import { useEffect, useState } from 'react';
import { useAuth } from '@/shared/dev-tool/auth-context';
import { dashboardService } from '../services/dashboard-service';
import { Dashboard } from '../types/dashboard.types';

export function useDashboard() {
  const { user } = useAuth();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboards() {
      try {
        setLoading(true);
        setError(null);
        
        let data: Dashboard[];
        if (user) {
          data = await dashboardService.getUserDashboards(user.id);
        } else {
          data = await dashboardService.getAllDashboards();
        }
        
        setDashboards(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboards');
        console.error('[useDashboard] Error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboards();
  }, [user]);

  return {
    dashboards,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      if (user) {
        dashboardService.getUserDashboards(user.id)
          .then(setDashboards)
          .catch(err => setError(err instanceof Error ? err.message : 'Failed to fetch dashboards'))
          .finally(() => setLoading(false));
      } else {
        dashboardService.getAllDashboards()
          .then(setDashboards)
          .catch(err => setError(err instanceof Error ? err.message : 'Failed to fetch dashboards'))
          .finally(() => setLoading(false));
      }
    }
  };
}
