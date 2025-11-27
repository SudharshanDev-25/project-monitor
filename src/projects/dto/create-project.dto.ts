import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { status } from '../enums/status.enums';

export class CreateProjectDto {
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

  @IsNotEmpty()
  @IsMongoId()
  team: string;
}
