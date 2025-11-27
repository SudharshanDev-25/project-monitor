/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  // User Registeration
  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);

    return {
      message: 'registered',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        designation: user.designation,
        role: user.role,
        status: user.status,
      },
    };
  }

  // User login Api
  @Post('user/login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async loginUser(@Body() dto: LoginDto) {
    const validated = await this.authService.validateUser(
      dto.email,
      dto.password,
    );
    return this.authService.login(validated);
  }

  // Admin login Api
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async loginAdmin(@Body() dto: LoginDto) {
    const validated = await this.authService.validateAdmin(
      dto.email,
      dto.password,
    );
    return this.authService.login(validated);
  }

  // Manager login Api
  @Post('manager/login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() dto: LoginDto) {
    const validated = await this.authService.validateManager(
      dto.email,
      dto.password,
    );
    return this.authService.login(validated);
  }
}
