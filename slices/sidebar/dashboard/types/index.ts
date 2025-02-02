// Frontend types and interfaces for the dashboard feature
import { MenuCategory, MenuItemWithChildren } from "@/shared/types/navigation-types"
import { User } from "@/shared/types/global"
import { z } from "zod";

// Frontend types (camelCase)
export interface Dashboard {
  id: string;
  dashboardId: string; // For backward compatibility
  name: string;
  description?: string;
  logo?: string;
  plan?: string;
  isPublic?: boolean;
  isActive?: boolean;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  menuItems?: MenuItemWithChildren[];
}

// Form values interface
export interface DashboardFormValues {
  name: string;
  description?: string;
  logo?: string;
  plan?: string;
  isPublic?: boolean;
}

export interface UseDashboardSwitcherProps {
  initialDashboards?: Dashboard[];
  onDashboardChange?: (dashboard: Dashboard) => void;
  defaultDashboardId?: string;
}

export const DASHBOARD_SWITCHER_LABELS = {
  NEW_DASHBOARD: 'Create Dashboard',
  NO_DASHBOARDS: 'No dashboards found',
  LOADING: 'Loading dashboards...',
  ERROR: 'Error loading dashboards',
  DASHBOARDS: 'Dashboards',
  ADD_DASHBOARD: 'Add Dashboard',
  BASE: 'Base Dashboard',
  CREATE: 'Create',
  EDIT: 'Edit',
  DELETE: 'Delete',
  SAVE: 'Save',
  CANCEL: 'Cancel',
  SEARCH: 'Search dashboards...',
  FILTER: 'Filter dashboards',
  SORT: 'Sort dashboards',
  EMPTY_STATE: 'No dashboards available',
  ERROR_STATE: 'Error loading dashboards'
} as const;

export const DASHBOARD_SWITCHER_SHORTCUTS = {
  NEW_DASHBOARD: '⌘N',
  BASE: '⌘'
} as const;

// Form validation schema
export const dashboardFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  logo: z.string().optional(),
  plan: z.string().optional(),
  isPublic: z.boolean().optional(),
  isActive: z.boolean().optional()
});

// Component props types
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

// Mutation types
export interface DashboardCreateInput extends Omit<Dashboard, 'id' | 'dashboardId' | 'createdAt' | 'updatedAt'> {
  userId?: string;
  userName?: string;
  userEmail?: string;
}

export interface DashboardUpdateInput extends DashboardCreateInput {
  id: string;
}

export interface DashboardMutationVariables {
  create: DashboardCreateInput;
  edit: DashboardUpdateInput;
  delete: { id: string };
  id: string;
}

export interface DashboardMutationResult {
  create: Dashboard;
  edit: Dashboard;
  delete: void;
}
