/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      this.logger.warn(`Invalid email attempt: ${email}`);
      throw new UnauthorizedException('Invalid email');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      this.logger.warn(`Invalid password attempt for email: ${email}`);
      throw new UnauthorizedException('Invalid password');
    }
    const { password: _p, ...result } = user.toObject ? user.toObject() : user;
    this.logger.log(`User validated: ${email}`);
    return result;
  }

  //  Login and loading data into payload
  async login(user: any) {
    try {
      await this.usersService.updateLoginDate(user.email);

      const payload = {
        sub: String(user._id),
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      };
      this.logger.log(`User logged in: ${user.email}`);
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      this.logger.error(`Error in login: ${error.message}`);
      throw new InternalServerErrorException('Login failed, please try again');
    }
  }
}
