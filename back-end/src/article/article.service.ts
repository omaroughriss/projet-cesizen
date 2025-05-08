import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './article.dto';
import { AuthUser } from 'src/auth/types/user.type';
import { hasRole } from 'src/auth/utils/roles';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  async createArticle(data: CreateArticleDto, currentUser: AuthUser) {
    if (!hasRole(currentUser, 'utilisateur')) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à accéder à cet article",
      );
    }
    return this.prisma.article.create({ data });
  }

  async getAllArticles() {
    return this.prisma.article.findMany({
      include: { category: true },
    });
  }

  async getArticleById(id: number) {
    return this.prisma.article.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async getArticlesByCategoryId(categoryId: number, currentUser: AuthUser) {
    if (!hasRole(currentUser, 'utilisateur')) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à accéder à cet article",
      );
    }
    return this.prisma.article.findMany({
      where: { categoryId },
      include: { category: true },
    });
  }

  async updateArticle(
    id: number,
    data: Partial<CreateArticleDto>,
    currentUser: AuthUser,
  ) {
    if (!hasRole(currentUser, 'utilisateur')) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à accéder à cet article",
      );
    }
    return this.prisma.article.update({
      where: { id },
      data: data,
    });
  }

  async deleteArticle(id: number, currentUser: AuthUser) {
    if (!hasRole(currentUser, 'administrateur')) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à accéder à cet article",
      );
    }
    return this.prisma.article.delete({ where: { id } });
  }
}
