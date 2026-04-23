import {
  IsString,
  Length,
  IsEmail,
  IsOptional,
  IsDateString,
  IsUrl,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 50)
  first_name: string;

  @IsString()
  @Length(2, 50)
  last_name: string;

  @IsUrl()
  avatar: string;

  @IsEmail()
  email: string;

  @IsString()
  information: string;

  @IsOptional()
  @IsString()
  @Length(10, 32)
  phone?: string;

  @IsDateString()
  birth_day: string;

  @IsString()
  password: string;
}