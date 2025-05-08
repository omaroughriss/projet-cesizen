import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './question.dto';
import { AuthUser } from 'src/auth/types/user.type';
import { hasRole } from 'src/auth/utils/roles';

@Injectable()
export class QuestionService {
    constructor(private readonly prisma: PrismaService) { }

    async createQuestion(data: CreateQuestionDto, currentUser: AuthUser) {
        if (!hasRole(currentUser, 'administrateur')) {
            throw new UnauthorizedException(
                "Vous n'êtes pas autorisé à accéder à cette ressource",
            );
        }
        return this.prisma.question.create({ data });
    }

    async getAllQuestions(currentUser: AuthUser) {
        if (!hasRole(currentUser, 'utilisateur')) {
            throw new UnauthorizedException(
                "Vous n'êtes pas autorisé à accéder à cette ressource",
            );
        }
        return this.prisma.question.findMany();
    }

    async getQuestionById(id: number, currentUser: AuthUser) {
        if (!hasRole(currentUser, 'utilisateur')) {
            throw new UnauthorizedException(
                "Vous n'êtes pas autorisé à accéder à cette ressource",
            );
        }
        return this.prisma.question.findUnique({
            where: { id },
        });
    }

    async updateQuestion(
        id: number,
        data: Partial<CreateQuestionDto>,
        currentUser: AuthUser,
    ) {
        if (!hasRole(currentUser, 'administrateur')) {
            throw new UnauthorizedException(
                "Vous n'êtes pas autorisé à accéder à cette ressource",
            );
        }
        return this.prisma.question.update({ where: { id }, data });
    }

    async deleteQuestion(id: number, currentUser: AuthUser) {
        if (!hasRole(currentUser, 'administrateur')) {
            throw new UnauthorizedException(
                "Vous n'êtes pas autorisé à accéder à cette ressource",
            );
        }
        return this.prisma.question.delete({ where: { id } });
    }
} 