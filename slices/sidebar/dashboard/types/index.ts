// /slices/dashboard/types/index.ts
import { MenuCategory, MenuItemWithChildren } from "@/shared/types/navigation-types"
import { User } from "@/shared/types/global"
import { z } from "zod";

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

// Base dashboard schema
export const dashboardSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  logo: z.string().optional(),
  plan: z.string().optional(),
  isPublic: z.boolean().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Form values schema
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

// Infer types from schemas
export type DashboardSchemaType = z.infer<typeof dashboardSchema>;
export type DashboardFormValues = z.infer<typeof dashboardFormSchema>;

// Frontend types (camelCase)
// Note: we use `dashboardId` as the unique identifier for UI purposes.
export interface Dashboard {
  dashboardId: string;
  name: string;
  icon?: string;
  logo: string;
  plan?: string;
  description?: string;
  menus?: DashboardMenu[];
  menuList?: MenuItemWithChildren[];
  defaultMenuId?: string;
  isActive?: boolean;
  isPublic?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  isDefault?: boolean;
  userNames?: string[];
  userEmails?: string[];
  userRoles?: string[];
}

export interface DashboardMenu {
  id: string;
  name: string;
  icon?: string;
  logo?: string;
  items: MenuItemWithChildren[];
  menuType: MenuCategory;
  isDefault?: boolean;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

// Input types for API operations
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

// Response types
export interface DashboardWithRole extends DashboardSchema {
  userId?: string;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  isDefault?: boolean;
}

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

export interface DashboardMutationVariables {
  create: DashboardCreateInput;
  edit: DashboardUpdateInput;
  delete: { id: string };
}

export interface DashboardMutationResult {
  create: Dashboard;
  edit: Dashboard;
  delete: void;
};

export const DASHBOARD_SWITCHER_LABELS = {
  DASHBOARDS: 'Dashboards',
  ADD_DASHBOARD: 'Add dashboard',
} as const;

export const DASHBOARD_SWITCHER_SHORTCUTS = {
  BASE: '⌘',
} as const;

export interface DashboardSwitcherProps {
  dashboards: Dashboard[];
  onDashboardChange: (dashboard: Dashboard) => void;
  className?: string;
  isMobile?: boolean;
  defaultDashboardId?: string;
}

export interface UseDashboardSwitcherProps {
  initialDashboards: Dashboard[];
  onDashboardChange?: (dashboard: Dashboard) => void;
  defaultDashboardId?: string;
}

// Utility functions for data transformation
export function transformToCamelCase(dashboard: DashboardSchema): Dashboard {
  return {
    dashboardId: dashboard.id,
    name: dashboard.name,
    description: dashboard.description || undefined,
    logo: dashboard.logo || 'layout-dashboard',
    plan: dashboard.plan || 'Personal',
    isPublic: dashboard.is_public,
    isActive: dashboard.is_active,
    createdAt: dashboard.created_at,
    updatedAt: dashboard.updated_at,
    isDefault: false,
    userNames: [],
    userEmails: [],
    userRoles: []
  };
}

export function transformToSnakeCase(input: DashboardCreateInput | DashboardUpdateInput): Partial<DashboardSchema> {
  return {
    name: input.name,
    description: input.description || null,
    logo: input.logo || 'layout-dashboard',
    plan: input.plan || 'Personal',
    is_public: input.isPublic || false,
    user_id: input.userId,
  };
}
