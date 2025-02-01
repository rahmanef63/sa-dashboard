import { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '@/shared/dev-tool/auth-context';
import { dashboardService } from '../api/dashboardService';
import { Dashboard } from '../types';

export const useDashboard = () => {
  const { user } = useAuth();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchRef = useRef<string | null>(null);
  const mountedRef = useRef(false);

  const fetchDashboards = useCallback(async () => {
    const currentUserId = user?.id || 'all';
    
    // Skip if we already fetched for this user
    if (lastFetchRef.current === currentUserId) {
      console.log('[useDashboard] Skipping fetch - already fetched for:', currentUserId);
      return;
    }

    // Don't set loading on subsequent fetches
    if (!mountedRef.current) {
      setIsLoading(true);
    }
    
    setError(null);
    try {
      // Only fetch user-specific dashboards, no need for both
      const data = user?.id 
        ? await dashboardService.getUserDashboards(user.id)
        : await dashboardService.getAllDashboards();

      console.log('[useDashboard] Fetched dashboards:', data);
      
      if (mountedRef.current) {
        setDashboards(data);
        lastFetchRef.current = currentUserId;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboards';
      console.error('[useDashboard] Error:', errorMessage);
      if (mountedRef.current) {
        setError(errorMessage);
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [user?.id]);

  useEffect(() => {
    mountedRef.current = true;
    console.log('[useDashboard] Initial dashboard fetch for user:', user?.id);
    fetchDashboards();

    return () => {
      mountedRef.current = false;
    };
  }, [fetchDashboards]);

  const refetch = useCallback(async () => {
    lastFetchRef.current = null; // Reset the fetch ref to force a new fetch
    await fetchDashboards();
  }, [fetchDashboards]);

  return {
    dashboards,
    isLoading,
    error,
    refetch
  };
};
