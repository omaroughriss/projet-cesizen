import { AuthUser } from 'src/auth/types/user.type';

export function hasRole(user: AuthUser, role: string): boolean {
  const roleHierarchy = [
    'utilisateur',
    'administrateur',
  ];

  const userRoleIndex = roleHierarchy.indexOf(user.role.roleName);
  const requiredRoleIndex = roleHierarchy.indexOf(role);

  return userRoleIndex >= requiredRoleIndex;
}
