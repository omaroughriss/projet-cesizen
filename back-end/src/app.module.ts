import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { ArticleModule } from './article/article.module';
import { CategoryModule } from './category/category.module';
import { QuestionModule } from './question/question.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UserModule,
    RoleModule,
    ArticleModule,
    CategoryModule,
    AuthModule,
    QuestionModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
