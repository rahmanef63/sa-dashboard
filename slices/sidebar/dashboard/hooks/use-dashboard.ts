import { useEffect, useState } from 'react';
import { useAuth } from '@/shared/dev-tool/auth-context';
import { dashboardService } from '../api/dashboardService';
import { Dashboard } from '../types';

export function useDashboard() {
  const { user } = useAuth();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data: Dashboard[];
      if (user) {
        data = await dashboardService.getUserDashboards(user.id);
      } else {
        data = await dashboardService.getAllDashboards();
      }
      
      console.log('[Debug] Fetched dashboards:', data);
      setDashboards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboards');
      console.error('[useDashboard] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    console.log('[Debug] Initial dashboard fetch for user:', user?.id);
    fetchDashboards();
  }, [user]);

  return {
    dashboards,
    loading,
    error,
    refetch: fetchDashboards
  };
}
