import { Role } from '@prisma/client';

export interface AuthUser {
  id: number;
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  username: string;
  roleId: number;
  activated: boolean;
  role: Role;
}

export interface AuthUserResponse extends Omit<AuthUser, 'password' | 'role'> {
  roleName: string;
}
