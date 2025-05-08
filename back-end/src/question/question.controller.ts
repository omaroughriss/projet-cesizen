import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    UseGuards,
    Request,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './question.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('questions')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    create(@Body() data: CreateQuestionDto, @Request() req) {
        return this.questionService.createQuestion(data, req.user);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    findAll(@Request() req) {
        return this.questionService.getAllQuestions(req.user);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    findOne(@Param('id') id: string, @Request() req) {
        return this.questionService.getQuestionById(parseInt(id, 10), req.user);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    update(
        @Param('id') id: string,
        @Body() data: Partial<CreateQuestionDto>,
        @Request() req,
    ) {
        return this.questionService.updateQuestion(parseInt(id, 10), data, req.user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    remove(@Param('id') id: string, @Request() req) {
        return this.questionService.deleteQuestion(parseInt(id, 10), req.user);
    }
} 