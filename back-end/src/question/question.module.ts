import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';
@Module({
    imports: [AuthModule],
    controllers: [QuestionController],
    providers: [QuestionService, PrismaService],
    exports: [QuestionService],
})
export class QuestionModule { } 