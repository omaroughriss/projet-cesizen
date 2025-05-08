import { Role } from '@prisma/client';

export type JwtPayload = {
  id: number;
  sub: number;
  email: string;
  role: Role;
};
