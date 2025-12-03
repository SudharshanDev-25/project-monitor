import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

export type TeamDocument = Team & Document;

@Schema({ timestamps: true })
export class Team {
  @Prop({ required: true })
  teamName: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  manager: User | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  teamLead: User | Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  members: (User | Types.ObjectId)[];
}

export const TeamSchema = SchemaFactory.createForClass(Team);
