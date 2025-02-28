import { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '@/shared/dev-tool/auth-context';
import { dashboardService } from '@/app/api/sidebar/dashboards/service';
import { Dashboard } from '../types';

export const useDashboard = () => {
  const { user } = useAuth();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [currentDashboard, setCurrentDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastFetchRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  const fetchDashboards = useCallback(async () => {
    const currentUserId = user?.id;
    
    if (!currentUserId || !isMountedRef.current) {
      console.log('[useDashboard] No user ID or component unmounted, skipping fetch', { userId: currentUserId });
      setError('User not authenticated');
      setIsLoading(false);
      
      // DEBUG: If no user, create a mock dashboard for testing
      if (!currentUserId) {
        console.log('[useDashboard] Creating mock dashboard for debugging');
        const mockDashboard: Dashboard = {
          id: 'debug-dashboard-id',
          dashboardId: 'debug-dashboard-id',
          name: 'Debug Dashboard',
          description: 'Auto-created for testing',
          isActive: true,
          isDefault: true,
          order: 0
        };
        setDashboards([mockDashboard]);
        setCurrentDashboard(mockDashboard);
        setIsLoading(false);
        setError(null);
      }
      
      return;
    }

    // Skip if we've already fetched for this user and have data
    if (lastFetchRef.current === currentUserId && dashboards.length > 0) {
      console.log('[useDashboard] Using cached dashboards for user', { userId: currentUserId, dashboardCount: dashboards.length });
      setIsLoading(false);
      return;
    }

    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      console.log('[useDashboard] Fetching dashboards for user', { userId: currentUserId });
      const response = await dashboardService.getUserDashboards(currentUserId);
      
      if (!isMountedRef.current) return;

      if (!response || !Array.isArray(response)) {
        throw new Error('Invalid dashboard data received');
      }

      lastFetchRef.current = currentUserId;

      if (response.length === 0) {
        console.warn('[useDashboard] No dashboards found for user', { userId: currentUserId });
        setDashboards([]);
        setCurrentDashboard(null);
      } else {
        console.log('[useDashboard] Dashboards fetched successfully', { count: response.length });
        setDashboards(response);
        // Set current dashboard only if none is selected or current one isn't in new list
        if (!currentDashboard || !response.find(d => d.id === currentDashboard.id)) {
          const defaultDashboard = response.find(d => d.isDefault) || response[0];
          console.log('[useDashboard] Setting default dashboard', { dashboardId: defaultDashboard?.id });
          setCurrentDashboard(defaultDashboard);
        }
      }

      setError(null);
    } catch (err) {
      if (!isMountedRef.current) return;
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboards';
      console.error('[useDashboard] Error fetching dashboards', { error: errorMessage });
      setError(errorMessage);
      // Only clear dashboards if we don't have any existing data
      if (dashboards.length === 0) {
        setDashboards([]);
        setCurrentDashboard(null);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [user?.id]);

  // Select a dashboard
  const selectDashboard = useCallback((dashboard: Dashboard) => {
    console.log('[useDashboard] Dashboard selected', { dashboardId: dashboard.id, name: dashboard.name });
    setCurrentDashboard(dashboard);
  }, []);

  // Fetch dashboards only when user changes
  useEffect(() => {
    isMountedRef.current = true;
    console.log('[useDashboard] Hook initialized', { userId: user?.id });

    if (user?.id) {
      fetchDashboards();
    } else {
      console.log('[useDashboard] No user logged in, using mock data');
      // Create a mock dashboard for testing if no user
      const mockDashboard: Dashboard = {
        id: 'mock-dashboard-id',
        dashboardId: 'mock-dashboard-id',
        name: 'Mock Dashboard',
        description: 'Auto-created because no user is logged in',
        isActive: true,
        isDefault: true,
        order: 0
      };
      setDashboards([mockDashboard]);
      setCurrentDashboard(mockDashboard);
      setError(null);
      setIsLoading(false);
    }

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [user?.id, fetchDashboards]);

  return {
    dashboards,
    currentDashboard,
    selectDashboard,
    isLoading,
    error,
    refetch: fetchDashboards
  };
};
