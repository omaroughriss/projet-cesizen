import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './role.dto';
import { AuthUser } from 'src/auth/types/user.type';
import { hasRole } from 'src/auth/utils/roles';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async createRole(data: CreateRoleDto, currentUser: AuthUser) {
    if (!hasRole(currentUser, 'administrateur')) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à accéder à cette ressource",
      );
    }
    return this.prisma.role.create({ data });
  }

  async getAllRoles(currentUser: AuthUser) {
    if (!hasRole(currentUser, 'administrateur')) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à accéder à cette ressource",
      );
    }
    return this.prisma.role.findMany();
  }

  async getRoleById(id: number, currentUser: AuthUser) {
    if (!hasRole(currentUser, 'administrateur')) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à accéder à cette ressource",
      );
    }
    return this.prisma.role.findUnique({
      where: { id },
    });
  }

  async updateRole(id: number, data: CreateRoleDto, currentUser: AuthUser) {
    if (!hasRole(currentUser, 'administrateur')) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à accéder à cette ressource",
      );
    }
    return this.prisma.role.update({ where: { id }, data });
  }

  async deleteRole(id: number, currentUser: AuthUser) {
    if (!hasRole(currentUser, 'administrateur')) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à accéder à cette ressource",
      );
    }
    return this.prisma.role.delete({ where: { id } });
  }
}
