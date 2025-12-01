import { Routes } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TeamsModule } from './teams/teams.module';
import { ProjectsModule } from './projects/projects.module';
import { TaskModule } from './task/task.module';

export const AppRoutes: Routes = [
  { path: 'users', module: UsersModule },
  { path: 'auth', module: AuthModule },
  { path: 'teams', module: TeamsModule },
  { path: 'projects', module: ProjectsModule },
  { path: 'task', module: TaskModule },
];
