import React, { createContext, useContext, useCallback, useState, useMemo } from 'react';
import type { DashboardInfo } from '@/slices/sidebar/dashboard/types';

interface DashboardContextType {
  currentDashboardId: string;
  availableDashboards: DashboardInfo[];
  setCurrentDashboard: (id: string) => void;
  addDashboard: (dashboard: DashboardInfo) => void;
  removeDashboard: (id: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const DEFAULT_DASHBOARD: DashboardInfo = {
  id: 'default',
  name: 'Default Dashboard',
  icon: 'dashboard',
  order: 0,
  dashboardId: 'default'
};

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [currentDashboardId, setCurrentDashboardId] = useState(DEFAULT_DASHBOARD.id);
  const [dashboards, setDashboards] = useState<DashboardInfo[]>([DEFAULT_DASHBOARD]);

  const setCurrentDashboard = useCallback((id: string) => {
    if (dashboards.some(d => d.id === id)) {
      setCurrentDashboardId(id);
    }
  }, [dashboards]);

  const addDashboard = useCallback((dashboard: DashboardInfo) => {
    setDashboards(prev => {
      if (prev.some(d => d.id === dashboard.id)) {
        return prev;
      }
      return [...prev, dashboard];
    });
  }, []);

  const removeDashboard = useCallback((id: string) => {
    if (id === DEFAULT_DASHBOARD.id) return; // Prevent removing default dashboard
    setDashboards(prev => prev.filter(d => d.id !== id));
    if (currentDashboardId === id) {
      setCurrentDashboardId(DEFAULT_DASHBOARD.id);
    }
  }, [currentDashboardId]);

  const value = useMemo(() => ({
    currentDashboardId,
    availableDashboards: dashboards,
    setCurrentDashboard,
    addDashboard,
    removeDashboard
  }), [currentDashboardId, dashboards, setCurrentDashboard, addDashboard, removeDashboard]);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
