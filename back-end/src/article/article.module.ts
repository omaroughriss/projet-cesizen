import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ArticleController],
  providers: [ArticleService, PrismaService],
  exports: [ArticleService],
})
export class ArticleModule {}
