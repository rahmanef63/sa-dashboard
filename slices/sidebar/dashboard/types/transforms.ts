// Data transformation utilities for dashboard types
import { Dashboard, DashboardCreateInput, DashboardUpdateInput } from './base';
import { DashboardUserRow } from '@/shared/types/dashboard';

export interface DashboardSchema {
  id: string;
  name: string;
  description?: string | null;
  logo?: string;
  plan?: string;
  is_public?: boolean;
  is_active?: boolean;
  is_default?: boolean;
  created_at: Date | string;
  updated_at: Date | string;
  user_id?: string;
  user_names?: string;
  user_emails?: string;
  user_roles?: string;
  menu_items?: any[];
}

/**
 * Transform snake_case database response to camelCase frontend type
 */
export function transformToCamelCase(data: DashboardUserRow | DashboardSchema): Dashboard {
  const isUserRow = 'dashboard_id' in data;
  
  return {
    id: isUserRow ? data.dashboard_id : data.id,
    dashboardId: isUserRow ? data.dashboard_id : data.id,
    name: data.name || '',
    description: data.description || '',
    logo: data.logo || 'layout-dashboard',
    plan: data.plan || 'Personal',
    isPublic: isUserRow ? data.is_public : (data as DashboardSchema).is_public || false,
    isActive: isUserRow ? data.is_active : (data as DashboardSchema).is_active || false,
    isDefault: isUserRow ? data.is_default : (data as DashboardSchema).is_default || false,
    createdAt: data.created_at instanceof Date ? data.created_at.toISOString() : String(data.created_at),
    updatedAt: data.updated_at instanceof Date ? data.updated_at.toISOString() : String(data.updated_at),
    userId: isUserRow ? data.user_id : (data as DashboardSchema).user_id,
    userName: isUserRow ? data.user_name : (data as DashboardSchema).user_names,
    userEmail: isUserRow ? data.user_email : (data as DashboardSchema).user_emails,
    order: 0, // Default order
    icon: data.logo || 'layout-dashboard'
  };
}

/**
 * Transform camelCase input to snake_case database format
 */
export function transformToSnakeCase(input: DashboardCreateInput | DashboardUpdateInput): Partial<DashboardSchema> {
  return {
    name: input.name,
    description: input.description || null,
    logo: input.logo || 'layout-dashboard',
    plan: input.plan || 'Personal',
    is_public: input.isPublic || false,
    user_id: 'userId' in input ? input.userId : undefined,
  };
}
