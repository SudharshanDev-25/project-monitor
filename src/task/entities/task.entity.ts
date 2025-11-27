import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { status } from '../enums/status.enums';
import { priority } from '../enums/priority.enums';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ enum: status, default: status.PENDING })
  status: string;

  @Prop({ required: true, enum: priority })
  priority: string;

  @Prop({ required: true })
  dueDate: string;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  project: Types.ObjectId | Project;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  assignedTo: Types.ObjectId | User;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
