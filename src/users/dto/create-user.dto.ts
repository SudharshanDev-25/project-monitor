import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { roles } from '../enums/role.enums';

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'Rahul Sharma',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'rahul@example.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Strong password for the user account',
    example: 'StrongPass123',
    minimum: 8,
    maximum: 20,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(20, { message: 'Password cannot exceed 20 characters' })
  password: string;

  @ApiProperty({
    description: 'Designation of the user in the company',
    example: 'Senior Developer',
  })
  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @ApiProperty({
    description: 'Role assigned to the user',
    enum: roles,
    example: roles.MANAGER,
  })
  @IsEnum(roles, {
    message: `Role must be one of: ${Object.values(roles).join(', ')}`,
  })
  role: roles;
}
