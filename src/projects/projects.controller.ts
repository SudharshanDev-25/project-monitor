/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { roles } from 'src/users/enums/role.enums';
import { CreateManagerProjectDto } from './dto/create-manager-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('get-all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  @HttpCode(HttpStatus.OK)
  getAllProjects() {
    return this.projectsService.getProjects();
  }

  @Post('save')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  createProject(@Body() dto: CreateProjectDto) {
    return this.projectsService.createProject(dto);
  }

  @Patch('update/:id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  updateProject(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.updateProject(id, dto);
  }

  // Delete Project
  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  @HttpCode(HttpStatus.OK)
  deleteProject(@Param('id') id: string) {
    return this.projectsService.deleteProject(id);
  }

  // Manager creates project
  @Post('manager/create')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.MANAGER)
  @HttpCode(HttpStatus.OK)
  createByManager(@Req() req, @Body() dto: CreateManagerProjectDto) {
    return this.projectsService.createProjectByManager(req.user.userId, dto);
  }

  // Manager gets all his projects
  @Get('manager/all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.MANAGER)
  @HttpCode(HttpStatus.OK)
  getByManager(@Req() req) {
    return this.projectsService.getProjectsByManager(req.user.userId);
  }
}
