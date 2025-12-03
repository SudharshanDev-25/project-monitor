/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TeamsService {
  private readonly logger = new Logger(TeamsService.name);
  constructor(
    @InjectModel(Team.name) private teamModel: Model<Team>,
    private readonly userService: UsersService,
  ) {}

  // Get All Teams

  async getTeams() {
    try {
      this.logger.log('Fetching all teams');
      return await this.teamModel
        .find()
        .populate('manager', 'name role')
        .populate('teamLead', 'name role')
        .populate('members', 'name role');
    } catch (error) {
      this.logger.error(`Failed to fetch teams: ${error.message}`);
      throw new InternalServerErrorException(error.message);
    }
  }

  // Create New Team

  async createTeam(dto: CreateTeamDto) {
    try {
      const { name, manager, teamLead, members } = dto;

      const managerUser = await this.userService.findById(manager);
      if (!managerUser) {
        this.logger.warn(`Manager not found: ${manager}`);
        throw new NotFoundException('Manager not found');
      }
      this.logger.log(`Manager found: ${managerUser._id}`);
      const memberUsers = await this.userService.findMembers(members);
      if (memberUsers.length !== members?.length) {
        this.logger.warn('Some members not found');
        throw new BadRequestException('Some members not found');
      }
      const team = new this.teamModel({
        name,
        manager: managerUser._id,
        teamLead: teamLead,
        members: memberUsers.map((m) => m._id),
      });

      const saved = await team.save();
      this.logger.log(`Team created: ${saved._id}`);
      return saved.populate('manager teamLead members', 'name role avatar');
    } catch (error) {
      this.logger.error(`Failed to create team: ${error.message}`);
      throw new InternalServerErrorException(error.message);
    }
  }

  // Update Team

  async updateTeam(id: string, dto: UpdateTeamDto) {
    try {
      const { name, manager, teamLead, members } = dto;

      const managerUser = await this.userService.findById(manager);
      if (!managerUser) {
        this.logger.warn(`Manager not found: ${manager}`);
        throw new NotFoundException('manager not found');
      }
      this.logger.log(`Manager found: ${managerUser._id}`);
      const memberUsers = await this.userService.findMembers(members);

      const updated = await this.teamModel
        .findByIdAndUpdate(
          id,
          {
            name,
            manager: managerUser._id,
            teamLead: teamLead,
            members: memberUsers.map((m) => m._id),
          },
          { new: true },
        )
        .populate('manager', 'name role avatar')
        .populate('teamLead', 'name role avatar')
        .populate('members', 'name role avatar');

      if (!updated) {
        this.logger.warn(`Team not found: ${id}`);
        throw new NotFoundException('Team not found');
      }
      this.logger.log(`Team updated: ${updated._id}`);
      return updated;
    } catch (error) {
      this.logger.error(`Failed to update team: ${error.message}`);
      throw new InternalServerErrorException(error.message);
    }
  }

  // Delete Team

  async deleteTeam(id: string) {
    try {
      const deleted = await this.teamModel.findByIdAndDelete(id);
      if (!deleted) {
        this.logger.warn(`Team not found: ${id}`);
        throw new NotFoundException('Team not found');
      }

      this.logger.log(`Team deleted: ${deleted._id}`);
      return { message: 'Team deleted successfully' };
    } catch (error) {
      this.logger.error(`Failed to delete team: ${error.message}`);
      throw new InternalServerErrorException(error.message);
    }
  }

  // Get Team Members by Manager

  async getTeamMembersByManager(managerId: string) {
    try {
      const teams = await this.teamModel
        .find({ manager: new Types.ObjectId(managerId) })
        .populate('teamLead', 'name designation status')
        .populate('members', 'name designation status');

      if (teams.length === 0) {
        this.logger.warn(`No teams found for manager: ${managerId}`);
        throw new NotFoundException('No teams found for this manager');
      }
      this.logger.log(`Teams found for manager: ${managerId}`);
      return {
        managerId,
        teams: teams.map((team) => ({
          teamId: team._id,
          teamLead: team.teamLead,
          members: team.members,
        })),
      };
    } catch (error) {
      this.logger.error(`Failed to get team members: ${error.message}`);
      throw new InternalServerErrorException(error.message);
    }
  }

  // Get Team Member Details

  async getMemberDetailsById(memberId: string) {
    try {
      const team = await this.teamModel
        .findOne({
          $or: [{ members: memberId }, { teamLead: memberId }],
        })
        .populate('manager', 'fullName email')
        .populate('teamLead', 'fullName email');

      if (!team) {
        this.logger.warn(`No team found for member: ${memberId}`);
        throw new NotFoundException('No team found for this member');
      }

      const member = await this.userService.findById(memberId);
      if (!member) throw new NotFoundException('Member not found');

      const user = {
        fullName: member.fullName,
        email: member.email,
        jobTitle: member.jobTitle,
        accountStatus: member.accountStatus,
        joinedAt: member.joinedAt,
      };
      this.logger.log(`Member details found for member: ${memberId}`);
      return {
        teamName: team.teamName,
        manger: team.manager,
        teamLead: team.teamLead,
        user,
      };
    } catch (error) {
      this.logger.error(`Failed to get member details: ${error.message}`);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByManagerId(id: string | undefined) {
    try {
      this.logger.log(`Finding team by manager ID: ${id}`);
      return this.teamModel.findOne({ manager: new Types.ObjectId(id) }).exec();
    } catch (error) {
      this.logger.error(`Failed to find team by manager ID: ${error.message}`);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findTeamsByMangerId(id: string | undefined) {
    try {
      this.logger.log(`Finding teams by manager ID: ${id}`);
      return this.teamModel.find({ manager: new Types.ObjectId(id) }).exec();
    } catch (error) {
      this.logger.error(`Failed to find teams by manager ID: ${error.message}`);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findTeamLeadsAndMembersByMangerTd(id: string | undefined) {
    try {
      this.logger.log(`Finding team leads and members by manager ID: ${id}`);
      return this.teamModel
        .find({ manager: new Types.ObjectId(id) })
        .select('members teamLead')
        .exec();
    } catch (error) {
      this.logger.error(
        `Failed to find team leads and members: ${error.message}`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
