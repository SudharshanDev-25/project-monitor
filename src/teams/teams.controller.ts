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

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get('get')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  @HttpCode(HttpStatus.OK)
  getAllTeams() {
    return this.teamsService.getTeams();
  }

  @Post('create')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createNewTeam(@Body() dto: CreateTeamDto) {
    return this.teamsService.createTeam(dto);
  }

  @Put('update/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  @HttpCode(HttpStatus.OK)
  updateTeam(@Param('id') id: string, @Body() dto: UpdateTeamDto) {
    return this.teamsService.updateTeam(id, dto);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  @HttpCode(HttpStatus.OK)
  deleteTeam(@Param('id') id: string) {
    return this.teamsService.deleteTeam(id);
  }

  @Get('manager/team')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.MANAGER)
  @HttpCode(HttpStatus.OK)
  teamMembersByManager(@Req() req: any) {
    const managerId = req.user.userId;
    return this.teamsService.getTeamMembersByManager(managerId);
  }

  @Get('/member')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.USER)
  teamMemberDetails(@Req() req: any) {
    const memberId = req.user.userId;
    return this.teamsService.getMemberDetailsById(memberId);
  }
}
