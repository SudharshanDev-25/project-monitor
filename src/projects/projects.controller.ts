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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SanitizeHtmlPipe } from 'src/pipes/sanitize-html.pipe';

@Controller('')
@ApiTags('projects')
@ApiBearerAuth('access-token')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('get-all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all projects (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all projects.' })
  getAllProjects() {
    return this.projectsService.getProjects();
  }

  @Post('save')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a new project (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'The project has been successfully created.',
  })
  createProject(@Body(new SanitizeHtmlPipe()) dto: CreateProjectDto) {
    return this.projectsService.createProject(dto);
  }

  @Patch('update/:id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a project' })
  @ApiResponse({
    status: 200,
    description: 'The project has been successfully updated.',
  })
  updateProject(
    @Param('id') id: string,
    @Body(new SanitizeHtmlPipe()) dto: UpdateProjectDto,
  ) {
    return this.projectsService.updateProject(id, dto);
  }

  // Delete Project
  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a project (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'The project has been successfully deleted.',
  })
  deleteProject(@Param('id') id: string) {
    return this.projectsService.deleteProject(id);
  }

  // Manager creates project
  @Post('manager/create')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a new project (Manager only)' })
  @ApiResponse({
    status: 200,
    description: 'The project has been successfully created by the manager.',
  })
  createByManager(
    @Req() req,
    @Body(new SanitizeHtmlPipe()) dto: CreateManagerProjectDto,
  ) {
    return this.projectsService.createProjectByManager(req.user.userId, dto);
  }

  // Manager gets all his projects
  @Get('manager/all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all projects for the manager (Manager only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all projects for the manager.',
  })
  getByManager(@Req() req) {
    return this.projectsService.getProjectsByManager(req.user.userId);
  }
}
