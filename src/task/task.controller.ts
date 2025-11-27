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

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // create task
  @Post('save')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() dto: CreateTaskDto) {
    return this.taskService.createTask(dto);
  }

  // get all task
  @Get('get-all')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.taskService.getAllTasks();
  }

  // update task
  @Put('update/:id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.taskService.updateTask(id, dto);
  }

  // delete task
  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }

  // manager get his team tasks
  @Get('manager/my-tasks')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.MANAGER)
  @HttpCode(HttpStatus.OK)
  getLeadTasks(@Req() req) {
    return this.taskService.getTasksForManager(req.user.userId);
  }

  // employee get his projects and tasks
  @Get('employee/my-tasks')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.USER)
  @HttpCode(HttpStatus.OK)
  getTasksByEmployee(@Req() req) {
    return this.taskService.getTasksByEmployee(req.user.userId);
  }
}
