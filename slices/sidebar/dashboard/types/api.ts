// API types and transformers
import { Dashboard } from './index';

export interface APIResponse {
  id: string;
  name: string;
  description: string | null;
  logo: string;
  plan: string;
  is_public: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user_id?: string;
  user_name?: string;
  user_email?: string;
  user_role?: string;
  is_default?: boolean;
}

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
