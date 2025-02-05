import type { Dashboard } from './base';

/**
 * Form related types for dashboard
 */
export interface DashboardFormValues {
  name: string;
  description?: string;
  logo?: string;
  plan?: string;
  isPublic?: boolean;
}

export interface DashboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "create" | "edit" | "delete";
  dashboardId?: string;
}

export interface DashboardFormProps {
  mode: "create" | "edit" | "delete";
  dashboardId?: string;
  onSuccess: () => void;
}

export interface DashboardSwitcherProps {
  dashboards: Dashboard[];
  onDashboardChange: (dashboard: Dashboard) => void;
  className?: string;
  isMobile?: boolean;
  defaultDashboardId?: string;
}

export interface UseDashboardSwitcherProps {
  initialDashboards?: Dashboard[];
  onDashboardChange?: (dashboard: Dashboard) => void;
  defaultDashboardId?: string;
}
