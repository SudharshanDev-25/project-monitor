import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { roles } from '../enums/role.enums';
import { status } from '../enums/status.enums';
import { workingStatus } from '../enums/working.status.enums';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, trim: true })
  jobTitle: string;

  @Prop({
    required: true,
    enum: roles,
    default: roles.USER,
  })
  role: roles;

  @Prop({
    enum: status,
    default: status.ACTIVE,
  })
  accountStatus: status;

  @Prop({ type: Date, default: null })
  lastLoginAt: Date;

  @Prop({
    enum: workingStatus,
    default: workingStatus.ACTIVE,
  })
  workStatus: workingStatus;

  @Prop({ type: Date })
  joinedAt: Date;

  @Prop({ type: Date, default: null })
  resignedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
