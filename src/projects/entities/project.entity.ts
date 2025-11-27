import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { status } from '../enums/status.enums';
import { Team } from 'src/teams/entities/team.entity';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  client: string;

  @Prop({ enum: status, default: status.PENDING })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Team' })
  team: Types.ObjectId | Team;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
