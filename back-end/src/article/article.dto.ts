import {
  IsInt,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  content: string;

  @IsString()
  @MinLength(1)
  image: string;

  @IsInt()
  categoryId: number;
}
