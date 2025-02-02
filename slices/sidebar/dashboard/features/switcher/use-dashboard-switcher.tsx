// /slices/dashboard/switcher/hooks/use-dashboard-switcher.ts
import { useState, useCallback, useMemo } from 'react';
import { Dashboard, UseDashboardSwitcherProps } from '@/slices/sidebar/dashboard/types';

export function useDashboardSwitcher({
  initialDashboards = [],
  onDashboardChange,
  defaultDashboardId = 'main'
}: UseDashboardSwitcherProps) {
  // Ensure initialDashboards is always an array and has required fields
  const dashboards = useMemo(() => {
    if (!Array.isArray(initialDashboards)) return [];
    
    return initialDashboards.map(dashboard => ({
      ...dashboard,
      // Ensure required fields have defaults
      dashboardId: dashboard.dashboardId,
      name: dashboard.name || 'Untitled Dashboard',
      logo: dashboard.logo || 'layout-dashboard'
    }));
  }, [initialDashboards]);

  // Find the default dashboard
  const defaultDashboard = useMemo(() => {
    const found = dashboards.find(d => d.dashboardId === defaultDashboardId);
    return found || dashboards[0] || null;
  }, [dashboards, defaultDashboardId]);

  // Keep track of the active dashboard
  const [activeDashboard, setActiveDashboard] = useState<Dashboard | null>(defaultDashboard);

  // Update active dashboard when dashboards or defaultDashboardId changes
  useMemo(() => {
    if (!activeDashboard || !dashboards.find(d => d.dashboardId === activeDashboard.dashboardId)) {
      setActiveDashboard(defaultDashboard);
    }
  }, [dashboards, defaultDashboard, activeDashboard]);

  const handleDashboardChange = useCallback((dashboard: Dashboard) => {
    console.log('[Debug] Dashboard Change:', dashboard);
    setActiveDashboard(dashboard);
    onDashboardChange?.(dashboard);
  }, [onDashboardChange]);

  return {
    activeDashboard: activeDashboard || defaultDashboard,
    setActiveDashboard: handleDashboardChange,
  };
}
