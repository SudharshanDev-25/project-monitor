/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { roles } from 'src/users/enums/role.enums';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('teams')
@ApiTags('Teams')
@ApiBearerAuth('access-token')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get('get')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all teams (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all teams.',
  })
  getAllTeams() {
    return this.teamsService.getTeams();
  }

  @Post('create')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a new team (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'The team has been successfully created.',
  })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createNewTeam(@Body() dto: CreateTeamDto) {
    return this.teamsService.createTeam(dto);
  }

  @Put('update/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a team (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'The team has been successfully updated.',
  })
  updateTeam(@Param('id') id: string, @Body() dto: UpdateTeamDto) {
    return this.teamsService.updateTeam(id, dto);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a team (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'The team has been successfully deleted.',
  })
  deleteTeam(@Param('id') id: string) {
    return this.teamsService.deleteTeam(id);
  }

  @Get('manager/team')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get team members for the manager (Manager only)' })
  @ApiResponse({
    status: 200,
    description: 'List of team members for the manager.',
  })
  teamMembersByManager(@Req() req: any) {
    const managerId = req.user.userId;
    return this.teamsService.getTeamMembersByManager(managerId);
  }

  @Get('/member')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.USER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get team member details (User only)' })
  @ApiResponse({
    status: 200,
    description: 'Details of the team member.',
  })
  teamMemberDetails(@Req() req: any) {
    const memberId = req.user.userId;
    return this.teamsService.getMemberDetailsById(memberId);
  }
}
