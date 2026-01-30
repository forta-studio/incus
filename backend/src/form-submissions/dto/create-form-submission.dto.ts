import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateFormSubmissionDto {
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
  @MaxLength(4000)
  message?: string;

  @IsBoolean()
  @IsOptional()
  sendCopy?: boolean;

  @IsBoolean()
  @IsOptional()
  mailingList?: boolean;
}
