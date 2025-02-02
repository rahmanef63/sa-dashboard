// API types and transformers
import { Dashboard } from './index';
import { DashboardUserRow } from '@/shared/types/dashboard';

// API response type
export interface APIResponse {
  data: DashboardUserRow[];
  message?: string;
  status: number;
}

// Re-export for convenience
export type { DashboardUserRow };

// Transform snake_case database response to camelCase frontend type
export function transformResponse(row: DashboardUserRow): Dashboard {
  return {
    id: row.id,
    dashboardId: row.dashboard_id || row.id, // Use id as dashboardId if not provided
    name: row.name || '',
    description: row.description,
    logo: row.logo,
    plan: row.plan,
    isPublic: row.is_public,
    isActive: row.is_active,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at as string,
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at as string,
    userId: row.user_id || row.id, // Use id as userId if not provided
    userName: row.user_name,
    userEmail: row.user_email,
    userRole: row.role,
    isDefault: row.is_default,
    menuItems: row.menu_items || []
  };
}
