/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { roles } from 'src/users/enums/role.enums';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('')
@ApiTags('task')
@ApiBearerAuth('access-token')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // create task
  @Post('save')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully created.',
  })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() dto: CreateTaskDto) {
    return this.taskService.createTask(dto);
  }

  // get all task
  @Get('get-all')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({
    status: 200,
    description: 'List of all tasks.',
  })
  findAll() {
    return this.taskService.getAllTasks();
  }

  // update task
  @Put('update/:id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully updated.',
  })
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.taskService.updateTask(id, dto);
  }

  // delete task
  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully deleted.',
  })
  delete(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }

  // manager get his team tasks
  @Get('manager/my-tasks')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all tasks for the manager (Manager only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all tasks for the manager.',
  })
  getLeadTasks(@Req() req) {
    return this.taskService.getTasksForManager(req.user.userId);
  }

  // employee get his projects and tasks
  @Get('employee/my-tasks')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.USER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all tasks for the employee (Employee only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all tasks for the employee.',
  })
  getTasksByEmployee(@Req() req) {
    return this.taskService.getTasksByEmployee(req.user.userId);
  }
}
