// /slices/dashboard/switcher/hooks/use-dashboard-switcher.ts
import { useState, useCallback, useMemo } from 'react';
import { Dashboard, UseDashboardSwitcherProps } from '@/slices/sidebar/dashboard/types';

export function useDashboardSwitcher({
  initialDashboards,
  onDashboardChange,
  defaultDashboardId = 'main'
}: UseDashboardSwitcherProps) {
  // Use dashboardId instead of id
  const defaultDashboard = useMemo(() =>
    initialDashboards.find(d => d.dashboardId === defaultDashboardId) || initialDashboards[0],
    [initialDashboards, defaultDashboardId]
  );

  const [activeDashboard, setActiveDashboard] = useState<Dashboard>(defaultDashboard);

  const menuItems = useMemo(() => {
    if (!activeDashboard) return [];

    if (activeDashboard.menuList) {
      return activeDashboard.menuList;
    }

    if (activeDashboard.menus?.length) {
      const defaultMenu = activeDashboard.menus.find(menu => menu.isDefault) || activeDashboard.menus[0];
      return defaultMenu.items;
    }

    return [];
  }, [activeDashboard]);

  const handleDashboardChange = useCallback((dashboard: Dashboard) => {
    setActiveDashboard(dashboard);
    onDashboardChange?.(dashboard);
  }, [onDashboardChange]);

  return {
    activeDashboard,
    menuItems,
    setActiveDashboard: handleDashboardChange,
  };
}
