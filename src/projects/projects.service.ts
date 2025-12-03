/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { TeamsService } from 'src/teams/teams.service';
import { CreateManagerProjectDto } from './dto/create-manager-project.dto';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    private readonly teamService: TeamsService,
  ) {}

  // Get all projects
  async getProjects() {
    try {
      this.logger.log('Fetching all projects');
      return await this.projectModel.find().populate({
        path: 'team',
        populate: [
          { path: 'manager', select: 'fullName email' },
          { path: 'teamLead', select: 'fullName email' },
          { path: 'members', select: 'fullName email' },
        ],
      });
    } catch (error) {
      this.logger.error(`Error fetching all projects: ${error.message}`);
      throw new InternalServerErrorException(error);
    }
  }

  // create new project
  async createProject(dto: CreateProjectDto) {
    try {
      const project = new this.projectModel({
        ...dto,
        team: new Types.ObjectId(dto.team),
      });
      this.logger.log(`Creating project: ${dto.title}`);

      await project.save();
      return project.populate('team');
    } catch (error) {
      this.logger.error(
        `Error creating project ${dto.title}: ${error.message}`,
      );
      throw new InternalServerErrorException(error);
    }
  }

  // update existing project
  async updateProject(id: string, dto: UpdateProjectDto) {
    try {
      const project = await this.projectModel
        .findByIdAndUpdate(id, dto, { new: true })
        .populate('team');

      if (!project) {
        this.logger.warn(`Project not found with ID: ${id}`);
        throw new NotFoundException('Project not found');
      }

      this.logger.log(`Updating project: ${project.title}`);

      return project;
    } catch (error) {
      this.logger.error(`Error updating project: ${error.message}`);
      throw new InternalServerErrorException(error);
    }
  }

  // Delete project
  async deleteProject(id: string) {
    try {
      const deleted = await this.projectModel.findByIdAndDelete(id);
      if (!deleted) {
        this.logger.warn(`Project not found with ID: ${id}`);
        throw new NotFoundException('Project not found');
      }
      this.logger.log(`Deleting project: ${deleted.title}`);
      return { message: 'Project deleted' };
    } catch (error) {
      this.logger.error(`Error deleting project: ${error.message}`);
      throw new InternalServerErrorException(error);
    }
  }

  // Add new project by manager
  async createProjectByManager(userId: string, dto: CreateManagerProjectDto) {
    try {
      const team = await this.teamService.findByManagerId(userId);
      if (!team) {
        this.logger.warn(`Team not found for manager with ID: ${userId}`);
        throw new NotFoundException('Team not found for this manager');
      }
      const project = new this.projectModel({
        ...dto,
        team: team._id,
      });

      await project.save();
      this.logger.log(`Creating project: ${dto.title}`);
      return project.populate('team');
    } catch (error) {
      this.logger.error(
        `Error creating project ${dto.title}: ${error.message}`,
      );
      throw new InternalServerErrorException(error);
    }
  }

  // Get projects that are belong to manager
  async getProjectsByManager(userId: string) {
    try {
      const teams = await this.teamService.findTeamsByMangerId(userId);
      if (teams.length === 0) {
        this.logger.warn(`No teams found for manager with ID: ${userId}`);
        throw new NotFoundException('No teams found for this manager');
      }

      const teamIds = teams.map((t) => t._id);
      this.logger.log(`Fetching projects for teams: ${teamIds.join(', ')}`);
      return await this.projectModel
        .find({ team: { $in: teamIds } })
        .populate('team');
    } catch (error) {
      this.logger.error(
        `Error fetching projects for manager: ${error.message}`,
      );
      throw new InternalServerErrorException(error);
    }
  }

  // project existence checked
  async isProjectExistById(id: string | undefined) {
    try {
      this.logger.log(`Checking existence of project with ID: ${id}`);
      return this.projectModel.findById(id);
    } catch (error) {
      this.logger.error(
        `Error checking project existence by ID ${id}: ${error.message}`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getProjectsByIds(id: string[] | undefined[]) {
    try {
      this.logger.log(`Fetching projects with IDs: ${id?.join(', ')}`);
      return this.projectModel
        .find({ _id: { $in: id } })
        .populate('team', 'teamName members')
        .select('title description status progress');
    } catch (error) {
      this.logger.error(
        `Error fetching projects by IDs ${id?.join(', ')}: ${error.message}`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
