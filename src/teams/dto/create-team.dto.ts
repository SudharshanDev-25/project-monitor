import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsMongoId()
  @IsNotEmpty()
  manager: string;

  @IsMongoId()
  @IsNotEmpty()
  teamLead: string;

  @IsArray()
  @IsMongoId({ each: true })
  members?: string[];
}
