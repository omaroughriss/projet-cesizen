import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [RoleController],
  providers: [RoleService, PrismaService],
  exports: [RoleService],
})
export class RoleModule {}
