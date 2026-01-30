import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { SubmissionType } from '@prisma/client';

export class CreateSubmissionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(190)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  message?: string;

  @IsEnum(SubmissionType)
  type: SubmissionType;
}

