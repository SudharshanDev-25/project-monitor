import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { roles } from './enums/role.enums';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('')
@ApiTags('users')
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('get-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all active users (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all active users.',
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  getActiveUsers() {
    return this.usersService.getActiveUsers();
  }

  // User Soft Delete
  @Patch('deactivate/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deactivate a user (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deactivated.',
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  deactivateUser(@Param('id') id: string) {
    return this.usersService.deactivateUser(id);
  }
}
