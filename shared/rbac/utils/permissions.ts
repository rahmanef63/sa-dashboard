import { Role, Permission } from '../types';
import { Roles } from '../roles';

export const hasPermission = (
  userRoles: Role[],
  requiredPermission: Permission['id']
): boolean => {
  return userRoles.some((role) =>
    role.permissions.some((permission) => permission.id === requiredPermission)
  );
};

export const hasAnyPermission = (
  userRoles: Role[],
  requiredPermissions: Permission['id'][]
): boolean => {
  return requiredPermissions.some((permission) => hasPermission(userRoles, permission));
};

export const hasAllPermissions = (
  userRoles: Role[],
  requiredPermissions: Permission['id'][]
): boolean => {
  return requiredPermissions.every((permission) => hasPermission(userRoles, permission));
};

export const getRolePermissions = (roleId: string): Permission[] => {
  const role = Object.values(Roles).find((r) => r.id === roleId);
  return role?.permissions || [];
};
