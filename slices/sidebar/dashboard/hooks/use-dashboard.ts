import { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '@/shared/dev-tool/auth-context';
import { dashboardService } from '@/app/api/sidebar/dashboards/service';
import { Dashboard } from '../types';
import { APIResponse } from '../types/api';

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
      setError('User not authenticated');
      setIsLoading(false);
      return;
    }

    // Skip if we've already fetched for this user and have data
    if (lastFetchRef.current === currentUserId && dashboards.length > 0) {
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
      const response = await dashboardService.getUserDashboards(currentUserId);
      
      if (!isMountedRef.current) return;

      if (!response || !Array.isArray(response)) {
        throw new Error('Invalid dashboard data received');
      }

      lastFetchRef.current = currentUserId;

      if (response.length === 0) {
        setDashboards([]);
        setCurrentDashboard(null);
      } else {
        setDashboards(response);
        // Set current dashboard only if none is selected or current one isn't in new list
        if (!currentDashboard || !response.find(d => d.id === currentDashboard.id)) {
          const defaultDashboard = response.find(d => d.isDefault) || response[0];
          setCurrentDashboard(defaultDashboard);
        }
      }

      setError(null);
    } catch (err) {
      if (!isMountedRef.current) return;
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboards';
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
  }, [user?.id]); // Remove unnecessary dependencies

  // Select a dashboard
  const selectDashboard = useCallback((dashboard: Dashboard) => {
    setCurrentDashboard(dashboard);
  }, []);

  // Fetch dashboards only when user changes
  useEffect(() => {
    isMountedRef.current = true;

    if (user?.id) {
      fetchDashboards();
    } else {
      setDashboards([]);
      setCurrentDashboard(null);
      setError('Please log in to view dashboards');
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
