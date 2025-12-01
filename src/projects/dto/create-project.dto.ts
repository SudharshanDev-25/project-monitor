import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { status } from '../enums/status.enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Title of the project',
    example: 'Inventory Management System',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the project',
    example:
      'A complete inventory system with barcode scanning and live tracking.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Client name for whom the project is created',
    example: 'GreenTech Solutions',
  })
  @IsString()
  @IsNotEmpty()
  client: string;

  @ApiProperty({
    description: 'Current status of the project',
    enum: status,
    example: status.PENDING,
    required: false,
  })
  @IsEnum(status, {
    message: `Status must be one of: ${Object.values(status).join(', ')}`,
  })
  @IsOptional()
  status?: status;

  @ApiProperty({
    description: 'Team ID associated with this project',
    example: '6751cfef12bac90098f600b7',
  })
  @IsMongoId()
  @IsNotEmpty()
  team: string;
}
