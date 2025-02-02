// API types and transformers
import { Dashboard } from './index';

// Base types for database rows (snake_case)
export interface BaseDashboardRow {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  plan?: string;
  is_public?: boolean;
  is_active?: boolean;
  created_at: Date;
  updated_at: Date;
}

// Extended type with user data (snake_case)
export interface UserDashboardRow extends BaseDashboardRow {
  user_role?: string;
  user_name?: string;
  user_email?: string;
  is_default?: boolean;
}

// API response type (snake_case)
export type APIResponse = UserDashboardRow;

// Transform snake_case database response to camelCase frontend type
export function transformResponse(response: APIResponse): Dashboard {
  return {
    id: response.id,
    dashboardId: response.id, // Map id to dashboardId for backward compatibility
    name: response.name,
    description: response.description || '',
    logo: response.logo || 'layout-dashboard',
    plan: response.plan || 'Personal',
    isPublic: response.is_public,
    isActive: response.is_active,
    isDefault: response.is_default,
    createdAt: response.created_at instanceof Date ? response.created_at.toISOString() : response.created_at,
    updatedAt: response.updated_at instanceof Date ? response.updated_at.toISOString() : response.updated_at,
    userName: response.user_name,
    userEmail: response.user_email,
    userRole: response.user_role
  };
}
