import {
    IsInt,
    IsString,
} from 'class-validator';

export class CreateQuestionDto {
    @IsString()
    question: string;

    @IsInt()
    score: number;
} 