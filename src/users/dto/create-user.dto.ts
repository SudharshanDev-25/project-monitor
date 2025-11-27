/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { roles } from '../enums/role.enums';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  designation: string;

  @IsEnum(roles)
  role: string;
}
