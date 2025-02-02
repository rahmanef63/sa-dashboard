// Data transformation utilities for dashboard types
import { Dashboard, DashboardSchema, DashboardCreateInput, DashboardUpdateInput } from './index';
import { APIResponse } from './api';

export function transformResponse(response: APIResponse): Dashboard {
  return {
    dashboardId: response.id,
    name: response.name,
    description: response.description || '',
    logo: response.logo || 'layout-dashboard',
    plan: response.plan || 'Personal',
    isPublic: response.is_public,
    isActive: response.is_active,
    isDefault: response.is_default,
    createdAt: response.created_at,
    updatedAt: response.updated_at,
    userId: response.user_id,
    userName: response.user_name,
    userEmail: response.user_email,
    userRole: response.user_role
  };
}

export function transformToCamelCase(dashboard: DashboardSchema): Dashboard {
  return {
    dashboardId: dashboard.id,
    name: dashboard.name,
    description: dashboard.description || '',
    logo: dashboard.logo || 'layout-dashboard',
    plan: dashboard.plan || 'Personal',
    isPublic: dashboard.is_public,
    isActive: dashboard.is_active,
    isDefault: dashboard.is_default,
    createdAt: dashboard.created_at instanceof Date ? dashboard.created_at.toISOString() : String(dashboard.created_at),
    updatedAt: dashboard.updated_at instanceof Date ? dashboard.updated_at.toISOString() : String(dashboard.updated_at),
    userId: dashboard.user_id,
    userName: dashboard.user_names,
    userEmail: dashboard.user_emails,
    userRole: dashboard.user_roles
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
