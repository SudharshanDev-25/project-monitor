/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Roles } from './decorators/roles.decorator';
import { roles } from 'src/users/enums/role.enums';
import { RolesGuard } from './guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SanitizeHtmlPipe } from 'src/pipes/sanitize-html.pipe';

@ApiTags('auth')
@Controller('')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  // User Registration
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User Registration' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully registered.',
  })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body(new SanitizeHtmlPipe()) dto: CreateUserDto) {
    const user = await this.usersService.create(dto);

    return {
      message: 'registered',
      user: {
        _id: user._id,
        name: user.fullName,
        email: user.email,
        jobTitle: user.jobTitle,
        role: user.role,
        accountStatus: user.accountStatus,
        joinedAt: user.joinedAt,
      },
    };
  }

  // User login Api
  @Post('user/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
  })
  @UseGuards(AuthGuard('local'), RolesGuard)
  @Roles(roles.USER)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async loginUser(@Body(new SanitizeHtmlPipe()) dto: LoginDto, @Req() req) {
    return this.authService.login(req.user);
  }

  // Admin login Api
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin Login' })
  @ApiResponse({
    status: 200,
    description: 'The admin has been successfully logged in.',
  })
  @UseGuards(AuthGuard('local'), RolesGuard)
  @Roles(roles.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async loginAdmin(@Body(new SanitizeHtmlPipe()) dto: LoginDto, @Req() req) {
    return this.authService.login(req.user);
  }

  // Manager login Api
  @Post('manager/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Manager Login' })
  @ApiResponse({
    status: 200,
    description: 'The manager has been successfully logged in.',
  })
  @UseGuards(AuthGuard('local'), RolesGuard)
  @Roles(roles.MANAGER)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body(new SanitizeHtmlPipe()) dto: LoginDto, @Req() req) {
    return this.authService.login(req.user);
  }
}
