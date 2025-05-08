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
import { ArticleService } from './article.service';
import { CreateArticleDto } from './article.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createArticle(@Body() data: CreateArticleDto, @Request() req) {
    return this.articleService.createArticle(data, req.user);
  }

  @Get()
  async getAllArticles() {
    return this.articleService.getAllArticles();
  }

  @Get(':id')
  async getArticleById(@Param('id') id: string) {
    return this.articleService.getArticleById(parseInt(id, 10));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateArticle(
    @Param('id') id: string,
    @Body() data: Partial<CreateArticleDto>,
    @Request() req,
  ) {
    return this.articleService.updateArticle(
      parseInt(id, 10),
      data,
      req.user,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteArticle(@Param('id') id: string, @Request() req) {
    return this.articleService.deleteArticle(parseInt(id, 10), req.user);
  }

  @Get('category/:categoryId')
  @UseGuards(JwtAuthGuard)
  async getArticlesByCategoryId(
    @Param('categoryId') categoryId: string,
    @Request() req,
  ) {
    return this.articleService.getArticlesByCategoryId(
      parseInt(categoryId, 10),
      req.user,
    );
  }
}
