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
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createCategory(@Body() data: CreateCategoryDto, @Request() req) {
    return this.categoryService.createCategory(data, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllCategories(@Request() req) {
    return this.categoryService.getAllCategories(req.user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getCategoryById(@Param('id') id: string, @Request() req) {
    return this.categoryService.getCategoryById(parseInt(id, 10), req.user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateCategory(
    @Param('id') id: string,
    @Body() data: Partial<UpdateCategoryDto>,
    @Request() req,
  ) {
    return this.categoryService.updateCategory(
      parseInt(id, 10),
      data,
      req.user,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteCategory(@Param('id') id: string, @Request() req) {
    return this.categoryService.deleteCategory(parseInt(id, 10), req.user);
  }
}
