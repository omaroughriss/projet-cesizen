import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './role.dto';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { AuthUser } from 'src/auth/types/user.type';
import { hasRole } from 'src/auth/utils/roles';
import { UnauthorizedException } from '@nestjs/common';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createRole(@Body() data: CreateRoleDto, @Request() req) {
    const user = req.user as AuthUser;
    if (!hasRole(user, 'administrateur')) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à accéder à cette ressource",
      );
    }
    return this.roleService.createRole(data, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllRoles(@Request() req) {
    const user = req.user as AuthUser;
    if (!hasRole(user, 'administrateur')) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à accéder à cette ressource",
      );
    }
    return this.roleService.getAllRoles(req.user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getRoleById(@Param('id') id: string, @Request() req) {
    return this.roleService.getRoleById(parseInt(id, 10), req.user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateRole(
    @Param('id') id: string,
    @Body() data: CreateRoleDto,
    @Request() req,
  ) {
    return this.roleService.updateRole(parseInt(id, 10), data, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteRole(@Param('id') id: string, @Request() req) {
    return this.roleService.deleteRole(parseInt(id, 10), req.user);
  }
}
