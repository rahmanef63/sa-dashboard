// Frontend types and interfaces for the dashboard feature
import { MenuCategory, MenuItemWithChildren } from "@/shared/types/navigation-types"
import { User } from "@/shared/types/global"
import { z } from "zod";

// Frontend types (camelCase)
export interface Dashboard {
  id: string;
  dashboardId: string;
  name: string;
  description?: string;
  logo: string;
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

// Database schema types (snake_case)
export interface DashboardSchema {
  id: string;
  name: string;
  description: string | null;
  logo: string;
  plan: string;
  is_public: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  user_id?: string;
  user_names?: string;
  user_emails?: string;
  user_roles?: string;
  is_default?: boolean;
}

// Form validation schema
export const dashboardFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  logo: z.string().optional(),
  plan: z.string().optional(),
  isPublic: z.boolean().optional(),
  userId: z.string().optional(),
  userName: z.string().optional(),
  userEmail: z.string().email("Invalid email").optional(),
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
export interface DashboardCreateInput extends DashboardFormValues {
  userId?: string;
  userName?: string;
  userEmail?: string;
}

export interface DashboardUpdateInput extends Partial<DashboardFormValues> {
  id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
}

export interface DashboardMutationVariables {
  create: DashboardCreateInput;
  edit: DashboardUpdateInput;
  delete: { id: string };
}

export interface DashboardMutationResult {
  create: Dashboard;
  edit: Dashboard;
  delete: void;
}
