import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ProjectQuestionsRepository,
  ProjectsRepository,
} from 'src/modules/projects/repositories';
import { ProjectValidationService } from 'src/modules/projects/services';
import { ProjectAction } from 'src/shared/base';
import { Project } from 'src/shared/entities';
import { testDataSeed } from 'src/test/data-seed';
import { TypeOrmTestingModule } from 'src/test/type-orm-testing.module';
import { EntityManager } from 'typeorm';

describe('ProjectValidationService', () => {
  let projectValidationService: ProjectValidationService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmTestingModule, TypeOrmModule.forFeature([Project])],
      providers: [
        ProjectsRepository,
        ProjectQuestionsRepository,
        ProjectValidationService,
      ],
    }).compile();
    const entityManager = moduleRef.get<EntityManager>(EntityManager);
    await testDataSeed(entityManager);
    projectValidationService = moduleRef.get<ProjectValidationService>(
      ProjectValidationService,
    );
  });

  it('should validate save responses request', async () => {
    const result = await projectValidationService.validateUpdateProject(
      {
        action: ProjectAction.Save,
        responses: [
          { questionId: 1, response: 2 },
          { questionId: 2, response: 8 },
        ],
      },
      1,
    );
    expect(result).toBeFalsy();
  });

  it('should pass through for send request', async () => {
    const result = await projectValidationService.validateUpdateProject(
      {
        action: ProjectAction.Send,
      },
      1,
    );
    expect(result).toBeFalsy();
  });
});
