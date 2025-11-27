/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcryptjs';
import { workingStatus } from './enums/working.status.enums';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Creating User Details
  async create(
    userDto: CreateUserDto,
    saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  ) {
    try {
      const existing = await this.userModel.findOne({ email: userDto.email });
      if (existing) throw new ConflictException('Email already registered');

      const hashed = await bcrypt.hash(userDto.password, saltRounds);

      const now = new Date().toLocaleString();

      const created = new this.userModel({
        ...userDto,
        password: hashed,
        lastLogin: now,
        joiningDate: now,
      });

      return (await created.save()).toObject();
    } catch (error) {
      throw error instanceof ConflictException
        ? error
        : new InternalServerErrorException(error.message);
    }
  }

  // Get all working users
  async getActiveUsers() {
    try {
      return this.userModel.find(
        {
          isWorking: 'active',
          role: { $ne: 'admin' },
        },
        {
          password: 0,
          createdAt: 0,
          updatedAt: 0,
          relivingDate: 0,
          __v: 0,
        },
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // User Data By Email
  async findByEmail(email: string) {
    try {
      return this.userModel.findOne({ email }).exec();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // User Data By Id
  async findById(id: string | undefined) {
    try {
      return this.userModel.findOne({ _id: id }).exec();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // Members Details
  async findMembers(members: string[] | undefined) {
    try {
      return this.userModel.find({ _id: { $in: members } });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // Login Date Update
  async updateLoginDate(email: string) {
    try {
      const last = new Date().toLocaleString();
      await this.userModel.updateOne({ email }, { $set: { lastLogin: last } });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // Soft Delete / Deactivate User
  async deactivateUser(id: string): Promise<string> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) throw new NotFoundException('User Not Found');

      user.isWorking = workingStatus.INACTIVE;
      user.relivingDate = new Date().toLocaleString();

      await user.save();
      return 'User Deactivated Successfully';
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException(error.message);
    }
  }
}
