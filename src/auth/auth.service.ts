/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { roles } from 'src/users/enums/role.enums';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  //  Validate User
  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);

      if (!user) throw new UnauthorizedException('Invalid email');

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new UnauthorizedException('Invalid password');

      if (user.role !== roles.USER) {
        throw new ForbiddenException('Access denied: Only users allowed');
      }

      const { password: _p, ...result } = user.toObject
        ? user.toObject()
        : user;

      return result;
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      console.error('Error in validateUser:', error);
      throw new InternalServerErrorException(
        'Something went wrong while validating user',
      );
    }
  }

  //  Validate Admin
  async validateAdmin(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);

      if (!user) throw new UnauthorizedException('Invalid email');

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new UnauthorizedException('Invalid password');

      if (user.role !== roles.ADMIN) {
        throw new ForbiddenException('Access denied: Only admins allowed');
      }

      const { password: _p, ...result } = user.toObject
        ? user.toObject()
        : user;

      return result;
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      console.error('Error in validateAdmin:', error);
      throw new InternalServerErrorException(
        'Something went wrong while validating admin',
      );
    }
  }

  //  Validate Manager
  async validateManager(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);

      if (!user) throw new UnauthorizedException('Invalid email');

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new UnauthorizedException('Invalid password');

      if (user.role !== roles.MANAGER) {
        throw new ForbiddenException('Access denied: Only managers allowed');
      }

      const { password: _p, ...result } = user.toObject
        ? user.toObject()
        : user;

      return result;
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      console.error('Error in validateManager:', error);
      throw new InternalServerErrorException(
        'Something went wrong while validating manager',
      );
    }
  }

  //  Login and loading data into payload
  async login(user: any) {
    try {
      await this.usersService.updateLoginDate(user.email);

      const payload = {
        sub: String(user._id),
        email: user.email,
        role: user.role,
        name: user.name,
      };

      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      console.error('Error in login:', error);
      throw new InternalServerErrorException('Login failed, please try again');
    }
  }
}
