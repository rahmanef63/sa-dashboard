import { Permission } from '../types';

// Define all available permissions
export const Permissions: Record<string, Permission> = {
  VIEW_DASHBOARD: {
    id: 'view_dashboard',
    name: 'View Dashboard',
    description: 'Can view dashboard',
  },
  MANAGE_USERS: {
    id: 'manage_users',
    name: 'Manage Users',
    description: 'Can create, update, and delete users',
  },
  VIEW_REPORTS: {
    id: 'view_reports',
    name: 'View Reports',
    description: 'Can view reports',
  },
  MANAGE_SETTINGS: {
    id: 'manage_settings',
    name: 'Manage Settings',
    description: 'Can manage application settings',
  },
  MANAGE_ORGANIZATIONS: {
    id: 'manage_organizations',
    name: 'Manage Organizations',
    description: 'Can manage organizations',
  },
} as const;
