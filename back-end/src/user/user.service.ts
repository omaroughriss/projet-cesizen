import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './user.dto';
import { AuthUser } from '../auth/types/user.type';
import { hasRole } from 'src/auth/utils/roles';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async createUser(data: CreateUserDto, currentUser: AuthUser) {
    if (!hasRole(currentUser, 'administrateur')) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à accéder à cette ressource",
      );
    }

    const hashedPassword = await this.hashPassword(data.password);

    return await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        roleId: 1,
      },
      include: {
        role: true,
      },
    });
  }

  async getAllUsers(currentUser: AuthUser) {
    if (!hasRole(currentUser, 'administrateur')) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à accéder à cette ressource",
      );
    }

    return this.prisma.user.findMany({
      include: {
        role: true,
      },
    });
  }

  async getUserById(id: number, currentUser: AuthUser) {
    if (!hasRole(currentUser, 'administrateur')) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à accéder à cette ressource",
      );
    }
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
      },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });
  }

  async findUsernameById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { username: true },
    });
  }

  async updateUser(
    id: number,
    data: Partial<CreateUserDto>,
    currentUser: AuthUser,
  ) {
    if (!hasRole(currentUser, 'administrateur')) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à accéder à cette ressource",
      );
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: number, currentUser: AuthUser) {
    if (!hasRole(currentUser, 'administrateur')) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à accéder à cette ressource",
      );
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }

  async desactivateUser(id: number, currentUser: AuthUser) {
    if (!hasRole(currentUser, 'administrateur')) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à accéder à cette ressource",
      );
    }
    return this.prisma.user.update({
      where: { id },
      data: { activated: false },
    });
  }

  async reactivateUser(id: number, currentUser: AuthUser) {
    if (!hasRole(currentUser, 'administrateur')) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à accéder à cette ressource",
      );
    }
    return this.prisma.user.update({
      where: { id },
      data: { activated: true },
    });
  }
}
