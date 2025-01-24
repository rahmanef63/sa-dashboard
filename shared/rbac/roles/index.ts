import { Role, RoleType } from '../types';
import { Permissions } from '../permissions';

export const Roles: Record<RoleType, Role> = {
  [RoleType.SUPER_ADMIN]: {
    id: RoleType.SUPER_ADMIN,
    name: 'Super Admin',
    description: 'Has full access to all features',
    permissions: Object.values(Permissions),
  },
  [RoleType.ADMIN]: {
    id: RoleType.ADMIN,
    name: 'Admin',
    description: 'Has access to most features except critical system settings',
    permissions: [
      Permissions.VIEW_DASHBOARD,
      Permissions.MANAGE_USERS,
      Permissions.VIEW_REPORTS,
      Permissions.MANAGE_SETTINGS,
    ],
  },
  [RoleType.MANAGER]: {
    id: RoleType.MANAGER,
    name: 'Manager',
    description: 'Can manage team members and view reports',
    permissions: [
      Permissions.VIEW_DASHBOARD,
      Permissions.VIEW_REPORTS,
      Permissions.MANAGE_USERS,
    ],
  },
  [RoleType.USER]: {
    id: RoleType.USER,
    name: 'User',
    description: 'Basic user access',
    permissions: [
      Permissions.VIEW_DASHBOARD,
      Permissions.VIEW_REPORTS,
    ],
  },
} as const;
