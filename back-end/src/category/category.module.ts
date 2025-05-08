import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService],
  exports: [CategoryService],
})
export class CategoryModule {}
