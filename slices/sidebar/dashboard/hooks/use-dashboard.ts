import { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '@/shared/dev-tool/auth-context';
import { dashboardService } from '@/app/api/sidebar/dashboards/service';
import { Dashboard } from '../types';
import { APIResponse } from '../types/api';

export const useDashboard = () => {
  const { user } = useAuth();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [currentDashboard, setCurrentDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchDashboards = useCallback(async () => {
    const currentUserId = user?.id;
    
    if (!currentUserId || lastFetchRef.current === currentUserId) {
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
      
      const data = await dashboardService.getUserDashboards(currentUserId);
      
      lastFetchRef.current = currentUserId;
      setDashboards(data);
      
      // Set first dashboard as current if none selected
      if (!currentDashboard && data.length > 0) {
        setCurrentDashboard(data[0]);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return;
        }
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, currentDashboard]);

  useEffect(() => {
    fetchDashboards();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchDashboards]);

  const selectDashboard = useCallback((dashboard: Dashboard) => {
    setCurrentDashboard(dashboard);
  }, []);

  return {
    dashboards,
    currentDashboard,
    isLoading,
    error,
    selectDashboard
  };
};
