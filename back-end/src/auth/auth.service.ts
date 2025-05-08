import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './types/jwt-payload.type';
import { AuthDto, ChangePasswordDto } from './auth.dto';
import { User } from '@prisma/client';
import { AuthUserResponse } from './types/user.type';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Error hashing password');
    }
  }

  async register(user: User) {
    const { password, ...rest } = user;

    try {
      const hashedPassword = await this.hashPassword(password);

      const user = await this.prisma.user.create({
        data: {
          ...rest,
          password: hashedPassword,
          activated: true,
          roleId: 2,
        },
      });

      return user;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Error registering user');
    }
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Error validating password');
    }
  }

  async generateJwt(user: JwtPayload): Promise<{ token: string }> {
    const payload: JwtPayload = {
      id: user.id,
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    try {
      const token = await this.jwtService.signAsync(payload);
      return { token };
    } catch (error) {
      console.error('Error generating JWT:', error);
      throw new UnauthorizedException('Error generating JWT');
    }
  }

  async login(authDto: AuthDto) {
    const { email, password } = authDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.validatePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      id: user.id,
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const { token } = await this.generateJwt(payload);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId,
        roleName: user.role.roleName,
        activated: user.activated,
      },
    };
  }

  async changePassword(userId: number, data: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    const isPasswordValid = await this.validatePassword(
      data.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Mot de passe actuel incorrect');
    }

    const hashedPassword = await this.hashPassword(data.newPassword);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Mot de passe mis à jour avec succès' };
  }

  async getCurrentUser(userId: number): Promise<AuthUserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, role, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      roleName: role.roleName,
    };
  }
}
