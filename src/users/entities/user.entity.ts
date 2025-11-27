import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { roles } from '../enums/role.enums';
import { status } from '../enums/status.enums';
import { workingStatus } from '../enums/working.status.enums';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  designation: string;

  @Prop({ required: true, default: 'user', enum: roles })
  role: string;

  @Prop({ default: 'active', enum: status })
  status: string;

  @Prop({ default: null })
  lastLogin: string;

  @Prop({ default: 'active', enum: workingStatus })
  isWorking: string;

  @Prop()
  joiningDate: string;

  @Prop({ default: null })
  relivingDate: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
