import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { ArticleModule } from './article/article.module';
import { CategoryModule } from './category/category.module';
import { QuestionModule } from './question/question.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false,
      }
    }),
    UserModule,
    RoleModule,
    ArticleModule,
    CategoryModule,
    AuthModule,
    QuestionModule,
    UploadModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
