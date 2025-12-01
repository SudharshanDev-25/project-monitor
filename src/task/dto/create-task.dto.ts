import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsMongoId,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { priority } from '../enums/priority.enums';
import { status } from '../enums/status.enums';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Title of the task',
    example: 'Design Login Page',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Short description of the task',
    example: 'Create UI and API integration for login',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Priority of the task',
    enum: priority,
    example: priority.MEDIUM,
    required: false,
  })
  @IsEnum(priority)
  @IsOptional()
  priority?: priority;

  @ApiProperty({
    description: 'Current status of the task',
    enum: status,
    example: status.PENDING,
    required: false,
  })
  @IsEnum(status)
  @IsOptional()
  status?: status;

  @ApiProperty({
    description: 'Due date for the task',
    example: '2025-12-21',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({
    description: 'Project ID associated with the task',
    example: '674f8fe27aac6f0001b7642e',
  })
  @IsMongoId()
  @IsNotEmpty()
  project: string;

  @ApiProperty({
    description: 'User ID assigned to the task',
    example: '674f91247aac6f0001b76439',
  })
  @IsMongoId()
  @IsNotEmpty()
  assignedTo: string;
}
