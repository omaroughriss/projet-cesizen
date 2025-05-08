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
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createUser(@Body() data: CreateUserDto, @Request() req) {
    return this.userService.createUser(data, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllUsers(@Request() req) {
    return this.userService.getAllUsers(req.user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') id: string, @Request() req) {
    return this.userService.getUserById(parseInt(id, 10), req.user);
  }

  @Get('username/:username')
  async getUserIdByUsername(@Param('username') username: string) {
    const user = await this.userService.findByUsername(username);

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return { id: user.id };
  }

  @Get('usernameid/:id')
  async getUsernameByUserId(@Param('id') id: string) {
    const user = await this.userService.findUsernameById(parseInt(id, 10));

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return { id: user.username };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() data: Partial<CreateUserDto>,
    @Request() req,
  ) {
    return this.userService.updateUser(parseInt(id, 10), data, req.user);
  }

  @Put(':id/desactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async desactivateUser(@Param('id') id: string, @Request() req) {
    return this.userService.desactivateUser(parseInt(id, 10), req.user);
  }

  @Put(':id/reactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async reactivateUser(@Param('id') id: string, @Request() req) {
    return this.userService.reactivateUser(parseInt(id, 10), req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteUser(@Param('id') id: string, @Request() req) {
    return this.userService.deleteUser(parseInt(id, 10), req.user);
  }
}
