import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './category.dto';
import { AuthUser } from 'src/auth/types/user.type';
import { hasRole } from 'src/auth/utils/roles';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(data: CreateCategoryDto, currentUser: AuthUser) {
    if (!hasRole(currentUser, 'administrateur')) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à accéder à cette ressource",
      );
    }
    return this.prisma.category.create({ data });
  }

  async getAllCategories(currentUser: AuthUser) {
    if (!hasRole(currentUser, 'utilisateur')) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à accéder à cette ressource",
      );
    }
    return this.prisma.category.findMany();
  }

  async getCategoryById(id: number, currentUser: AuthUser) {
    if (!hasRole(currentUser, 'utilisateur')) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à accéder à cette ressource",
      );
    }
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  async updateCategory(
    id: number,
    data: Partial<CreateCategoryDto>,
    currentUser: AuthUser,
  ) {
    if (!hasRole(currentUser, 'administrateur')) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à accéder à cette ressource",
      );
    }
    return this.prisma.category.update({ where: { id }, data });
  }

  async deleteCategory(id: number, currentUser: AuthUser) {
    if (!hasRole(currentUser, 'administrateur')) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à accéder à cette ressource",
      );
    }
    return this.prisma.category.delete({ where: { id } });
  }
}
