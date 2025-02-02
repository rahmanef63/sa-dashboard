import { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '@/shared/dev-tool/auth-context';
import { dashboardService } from '@/app/api/sidebar/dashboards/service';
import { Dashboard } from '../types';
import { APIResponse } from '../types/api';

export const useDashboard = () => {
  const { user } = useAuth();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [currentDashboard, setCurrentDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading state
  const [error, setError] = useState<string | null>(null);
  const lastFetchRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchDashboards = useCallback(async () => {
    const currentUserId = user?.id;
    
    if (!currentUserId) {
      setError('No user ID available');
      setIsLoading(false);
      return;
    }

    // Skip if we've already fetched for this user
    if (lastFetchRef.current === currentUserId && dashboards.length > 0) {
      setIsLoading(false);
      return;
    }

    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('[Dashboard Hook] Fetching dashboards for user:', currentUserId);
      const data = await dashboardService.getUserDashboards(currentUserId);
      console.log('[Dashboard Hook] Received dashboards:', data);
      
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid dashboard data received');
      }
      
      lastFetchRef.current = currentUserId;
      setDashboards(data);
      
      // Set first dashboard as current if none selected
      if (!currentDashboard && data.length > 0) {
        setCurrentDashboard(data[0]);
      }

      setIsLoading(false);
    } catch (error: unknown) {
      console.error('[Dashboard Hook] Error:', error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return;
        }
        setError(error.message);
      } else {
        setError('An unknown error occurred while fetching dashboards');
      }
      setIsLoading(false);
    }
  }, [user?.id, currentDashboard, dashboards.length]);

  // Select a dashboard
  const selectDashboard = useCallback((dashboard: Dashboard) => {
    setCurrentDashboard(dashboard);
  }, []);

  // Fetch dashboards when user changes
  useEffect(() => {
    if (user?.id) {
      fetchDashboards();
    } else {
      setDashboards([]);
      setCurrentDashboard(null);
      setError('Please log in to view dashboards');
      setIsLoading(false);
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [user?.id, fetchDashboards]);

  return {
    dashboards,
    currentDashboard,
    isLoading,
    error,
    refetch: fetchDashboards,
    setCurrentDashboard,
    selectDashboard
  };
};
