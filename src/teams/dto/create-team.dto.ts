import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({
    description: 'Name of the team',
    example: 'Frontend Development Team',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Manager ID responsible for the team',
    example: '6751cdef12abc90001f600d4',
  })
  @IsMongoId()
  @IsNotEmpty()
  manager: string;

  @ApiProperty({
    description: 'Team lead ID assigned to guide team members',
    example: '6751ceff98acb90031f600a1',
  })
  @IsMongoId()
  @IsNotEmpty()
  teamLead: string;

  @ApiProperty({
    description: 'List of team member IDs',
    example: ['6751cfef12bac90098f600b7', '6751abff12ade90011f60321'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  members?: string[];
}
