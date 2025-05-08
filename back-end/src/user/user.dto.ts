import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  lastName: string;

  @IsString()
  firstName: string;

  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsBoolean()
  activated: boolean;

  @IsInt()
  roleId: number;
}
