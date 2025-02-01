// /slices/dashboard/switcher/hooks/use-dashboard-switcher.ts
import { useState, useCallback, useMemo } from 'react';
import { Dashboard, UseDashboardSwitcherProps } from '@/slices/sidebar/dashboard/types';

export function useDashboardSwitcher({
  initialDashboards,
  onDashboardChange,
  defaultDashboardId = 'main'
}: UseDashboardSwitcherProps) {
  // Find the default dashboard
  const defaultDashboard = useMemo(() =>
    initialDashboards.find(d => d.dashboardId === defaultDashboardId) || initialDashboards[0],
    [initialDashboards, defaultDashboardId]
  );

  // Keep track of the active dashboard
  const [activeDashboard, setActiveDashboard] = useState<Dashboard | null>(null);

  // Update active dashboard when initialDashboards or defaultDashboardId changes
  useCallback(() => {
    if (!activeDashboard || !initialDashboards.find(d => d.dashboardId === activeDashboard.dashboardId)) {
      setActiveDashboard(defaultDashboard);
    }
  }, [initialDashboards, defaultDashboard, activeDashboard]);

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
