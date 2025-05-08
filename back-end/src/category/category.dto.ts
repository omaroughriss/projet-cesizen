import { IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(1)
  categoryName: string;
}

export class UpdateCategoryDto extends CreateCategoryDto {}
