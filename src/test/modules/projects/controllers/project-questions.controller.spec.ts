import { Test } from '@nestjs/testing';
import { ProjectQuestionsController } from 'src/modules/projects/controllers';
import {
  ProjectAuthorizationRepository,
  ProjectQuestionsRepository,
} from 'src/modules/projects/repositories';
import {
  ProjectAuthorizationService,
  ProjectQuestionsService,
} from 'src/modules/projects/services';
import { testDataSeed } from 'src/test/data-seed';
import { TypeOrmTestingModule } from 'src/test/type-orm-testing.module';
import { EntityManager } from 'typeorm';

describe('ProjectQuestionsController', () => {
  let projectQuestionsController: ProjectQuestionsController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProjectQuestionsController],
      imports: [TypeOrmTestingModule],
      providers: [
        ProjectQuestionsService,
        ProjectQuestionsRepository,
        ProjectAuthorizationRepository,
        ProjectAuthorizationService,
      ],
    }).compile();
    projectQuestionsController = moduleRef.get<ProjectQuestionsController>(
      ProjectQuestionsController,
    );
    const entityManager = moduleRef.get<EntityManager>(EntityManager);
    await testDataSeed(entityManager);
  });

  it('should return questions for project', async () => {
    const result = await projectQuestionsController.getQuestions({
      projectId: 1,
    });
    expect(result.length).toBe(2);
  });
});
