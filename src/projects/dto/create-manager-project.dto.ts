import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { status } from '../enums/status.enums';

export class CreateManagerProjectDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  client: string;

  @IsOptional()
  @IsEnum(status)
  status: string;
}
