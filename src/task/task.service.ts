/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TeamsService } from 'src/teams/teams.service';
import { ProjectsService } from 'src/projects/projects.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private readonly teamService: TeamsService,
    private readonly projectService: ProjectsService,
  ) {}

  // Create new Task that is related to project
  async createTask(dto: CreateTaskDto) {
    const projectExists = await this.projectService.isProjectExistById(
      dto.project,
    );

    if (!projectExists) {
      throw new NotFoundException('Project not found');
    }

    const newTask = await this.taskModel.create(dto);

    return newTask.populate([
      { path: 'project' },
      { path: 'assignedTo', select: 'name email' },
    ]);
  }

  // get all tasks
  async getAllTasks() {
    return this.taskModel
      .find()
      .populate('project', 'title')
      .populate('assignedTo', 'name email');
  }

  // update task
  async updateTask(id: string, dto: UpdateTaskDto) {
    const task = await this.taskModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('project', 'title')
      .populate('assignedTo', 'name email');

    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  // delete task
  async deleteTask(id: string) {
    const task = await this.taskModel.findByIdAndDelete(id);
    if (!task) throw new NotFoundException('Task not found');

    return { message: 'Task deleted successfully' };
  }

  // get tasks for manager
  async getTasksForManager(managerId: string) {
    const teams =
      await this.teamService.findTeamLeadsAndMembersByMangerTd(managerId);

    if (!teams.length) return [];
    const memberIds: string[] = [];
    teams.forEach((team) => {
      if (team.members && team.members.length > 0) {
        memberIds.push(...team.members.map((m) => m.toString()));
      }
      if (team.teamLead) {
        memberIds.push(team.teamLead.toString());
      }
    });

    return this.taskModel
      .find({ assignedTo: { $in: memberIds } })
      .populate('assignedTo', 'name email')
      .populate('project', 'title');
  }

  // get tasks & projects for employee
  async getTasksByEmployee(employeeId: string) {
    const tasks = await this.taskModel
      .find({ assignedTo: employeeId })
      .populate('project', 'title status')
      .populate('assignedTo', 'name email');

    const projectIds = tasks.map((t: any) => t.project._id);

    const projects = await this.projectService.getProjectsByIds(projectIds);

    return { success: true, tasks, projects };
  }
}
