import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { status } from '../enums/status.enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateManagerProjectDto {
  @ApiProperty({
    description: 'Title of the project',
    example: 'E-Commerce Web Platform',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Description of the project',
    example:
      'Building scalable e-commerce web application with payment integration',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Name of the client for this project',
    example: 'TechZone Pvt Ltd',
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
}
