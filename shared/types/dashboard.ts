import { User } from './global';
import { MenuItem } from '../slices/sidebar/menu/types/';
import { BaseRow } from '@/slices/sidebar/config/admin-db';

// Shared database row type for dashboards
export interface DashboardBaseRow extends BaseRow {
  name?: string;
  description?: string;
  logo?: string;
  plan?: string;
  is_public?: boolean;
  is_active?: boolean;
}

// Extended type with user data (snake_case)
export interface DashboardUserRow extends DashboardBaseRow {
  user_id: string;
  dashboard_id: string;
  role: string;
  is_default: boolean;
  user_name?: string;
  user_email?: string;
  menu_items?: MenuItem[];
}

// Type for database query results
export interface QueryRow extends Record<string, any> {
  id: string;
  created_at: Date;
  updated_at: Date;
}

// Helper function to transform query row to dashboard row
export function transformQueryToDashboardRow(row: QueryRow): DashboardUserRow {
  return {
    id: row.id,
    created_at: row.created_at,
    updated_at: row.updated_at,
    user_id: row.user_id || '',
    dashboard_id: row.dashboard_id || '',
    role: row.role || 'viewer',
    is_default: row.is_default || false,
    user_name: row.user_name,
    user_email: row.user_email,
    // Dashboard fields
    name: row.name || row.title || '',
    description: row.description,
    logo: row.logo,
    plan: row.plan,
    is_public: row.is_public,
    is_active: row.is_active,
    menu_items: row.menu_items || []
  };
}
