import { Module } from '@nestjs/common';
import {
  AmountRangeRepository,
  ManagedUsersRepository,
  ProjectAssignmentsRepository,
  ProjectAuthorizationRepository,
  ProjectQuestionsRepository,
  ProjectResponsesRepository,
  ProjectStatusChangeRepository,
  ProjectStatusRepository,
  ProjectsRepository,
  RegionsRepository,
} from './repositories';
import {
  ProjectFiltersController,
  ProjectQuestionsController,
  ProjectsController,
} from './controllers';
import {
  ProjectAuthorizationService,
  ProjectFiltersService,
  ProjectQuestionsService,
  ProjectValidationService,
  ProjectsService,
} from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project, ProjectStatusChange, Response } from 'src/shared/entities';
import { UbicationsRepository } from './repositories/ubications.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectStatusChange, Response])],
  providers: [
    ProjectsService,
    ProjectsRepository,
    ProjectFiltersService,
    ProjectStatusRepository,
    RegionsRepository,
    UbicationsRepository,
    AmountRangeRepository,
    ProjectQuestionsService,
    ProjectQuestionsRepository,
    ProjectAuthorizationRepository,
    ProjectAuthorizationService,
    ProjectStatusChangeRepository,
    ProjectResponsesRepository,
    ProjectAssignmentsRepository,
    ProjectValidationService,
    ManagedUsersRepository,
  ],
  controllers: [
    ProjectsController,
    ProjectFiltersController,
    ProjectQuestionsController,
  ],
})
export class ProjectsModule {}
