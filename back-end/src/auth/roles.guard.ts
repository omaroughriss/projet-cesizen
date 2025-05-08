import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { ROLES_KEY } from '../auth/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new ForbiddenException('No token provided');
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token);
      const user = decoded as JwtPayload;

      const userFromDb = await this.prisma.user.findUnique({
        where: { id: user.id },
        include: { role: true },
      });

      if (!userFromDb) {
        throw new ForbiddenException('User not found');
      }

      if (!requiredRoles.includes(userFromDb.role.roleName)) {
        throw new ForbiddenException(
          'You do not have the required permissions',
        );
      }

      request.user = userFromDb;
      return true;
    } catch (error) {
      throw new ForbiddenException('Invalid or expired token');
    }
  }
}
