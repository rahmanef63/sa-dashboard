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
}

// Frontend types (camelCase)
export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  logo: string;
  plan: string;
  isPublic: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

export interface DashboardFormValues {
  name: string;
  description?: string;
  logo?: string;
  plan?: string;
  isPublic?: boolean;
  userId?: string;
}

export interface DashboardCreateInput extends DashboardFormValues {
  userId?: string;
}

export interface DashboardUpdateInput extends Partial<DashboardFormValues> {
  userId?: string;
}

export interface DashboardSwitcherProps {
  dashboards: Dashboard[];
  onDashboardChange: (dashboard: Dashboard) => void;
  className?: string;
  isMobile?: boolean;
  defaultDashboardId?: string;
}

// Type guard to check if an object is a DashboardSchema
export function isDashboardSchema(obj: any): obj is DashboardSchema {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.is_public === 'boolean' &&
    typeof obj.is_active === 'boolean' &&
    obj.created_at instanceof Date &&
    obj.updated_at instanceof Date
  );
}

// Utility functions for data transformation
export function transformToCamelCase(dashboard: DashboardSchema): Dashboard {
  return {
    id: dashboard.id,
    name: dashboard.name,
    description: dashboard.description || undefined,
    logo: dashboard.logo,
    plan: dashboard.plan,
    isPublic: dashboard.is_public,
    isActive: dashboard.is_active,
    createdAt: dashboard.created_at,
    updatedAt: dashboard.updated_at,
    userId: dashboard.user_id,
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
