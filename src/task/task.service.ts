/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TeamsService } from 'src/teams/teams.service';
import { ProjectsService } from 'src/projects/projects.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private readonly teamService: TeamsService,
    private readonly projectService: ProjectsService,
  ) {}

  // Create Task
  async createTask(dto: CreateTaskDto) {
    try {
      const projectExists = await this.projectService.isProjectExistById(
        dto.project,
      );

      if (!projectExists) {
        this.logger.warn(`Project not found: ${dto.project}`);
        throw new NotFoundException('Project not found');
      }

      const newTask = await this.taskModel.create(dto);
      this.logger.log(`Task created: ${dto.title}`);

      return newTask.populate([
        { path: 'project' },
        { path: 'assignedTo', select: 'fullName email' },
      ]);
    } catch (error) {
      this.logger.error(`Failed to create task: ${error.message}`);
      throw new InternalServerErrorException('Unable to create task');
    }
  }

  // Get all tasks
  async getAllTasks() {
    try {
      this.logger.log('Fetching all tasks');
      return await this.taskModel
        .find()
        .populate('project', 'title')
        .populate('assignedTo', 'fullName email');
    } catch (error) {
      this.logger.error(`Failed to fetch tasks: ${error.message}`);
      throw new InternalServerErrorException('Unable to fetch tasks');
    }
  }

  // Update Task
  async updateTask(id: string, dto: UpdateTaskDto) {
    try {
      const task = await this.taskModel
        .findByIdAndUpdate(id, dto, { new: true })
        .populate('project', 'title')
        .populate('assignedTo', 'fullName email');

      if (!task) {
        this.logger.warn(`Task not found: ${id}`);
        throw new NotFoundException('Task not found');
      }
      this.logger.log(`Task updated: ${id}`);
      return task;
    } catch (error) {
      this.logger.error(`Failed to update task: ${error.message}`);
      throw new InternalServerErrorException('Unable to update task');
    }
  }

  // Delete Task
  async deleteTask(id: string) {
    try {
      const task = await this.taskModel.findByIdAndDelete(id);

      if (!task) {
        this.logger.warn(`Task not found for deletion: ${id}`);
        throw new NotFoundException('Task not found');
      }
      this.logger.log(`Task deleted: ${id}`);
      return { message: 'Task deleted successfully' };
    } catch (error) {
      this.logger.error(`Failed to delete task: ${error.message}`);
      throw new InternalServerErrorException('Unable to delete task');
    }
  }

  // Tasks for Manager
  async getTasksForManager(managerId: string) {
    try {
      const teams =
        await this.teamService.findTeamLeadsAndMembersByMangerTd(managerId);

      if (!teams.length) return [];

      const memberIds: string[] = [];

      teams.forEach((team) => {
        if (team.members?.length) {
          memberIds.push(...team.members.map((m) => m.toString()));
        }
        if (team.teamLead) {
          memberIds.push(team.teamLead.toString());
        }
      });
      this.logger.log(`Tasks fetched for manager: ${managerId}`);
      return await this.taskModel
        .find({ assignedTo: { $in: memberIds } })
        .populate('assignedTo', 'fullName email')
        .populate('project', 'title');
    } catch (error) {
      this.logger.error(`Failed fetching manager tasks: ${error.message}`);
      throw new InternalServerErrorException('Unable to fetch manager tasks');
    }
  }

  // Tasks by Employee
  async getTasksByEmployee(employeeId: string) {
    try {
      const tasks = await this.taskModel
        .find({ assignedTo: employeeId })
        .populate('project', 'title status')
        .populate('assignedTo', 'fullName email');

      const projectIds = tasks.map((t: any) => t.project._id);

      const projects = await this.projectService.getProjectsByIds(projectIds);
      this.logger.log(`Tasks fetched for employee: ${employeeId}`);
      return { success: true, tasks, projects };
    } catch (error) {
      this.logger.error(`Failed fetching employee tasks: ${error.message}`);
      throw new InternalServerErrorException('Unable to fetch employee tasks');
    }
  }
}
