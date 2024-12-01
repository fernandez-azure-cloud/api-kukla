import { Test } from '@nestjs/testing';
import { ProjectQuestionsRepository } from 'src/modules/projects/repositories';
import { ProjectQuestionsService } from 'src/modules/projects/services';
import { testDataSeed } from 'src/test/data-seed';
import { TypeOrmTestingModule } from 'src/test/type-orm-testing.module';
import { EntityManager } from 'typeorm';

describe('ProjectQuestionsService', () => {
  let projectQuestionsService: ProjectQuestionsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmTestingModule],
      providers: [ProjectQuestionsRepository, ProjectQuestionsService],
    }).compile();
    projectQuestionsService = moduleRef.get<ProjectQuestionsService>(
      ProjectQuestionsService,
    );
    const entityManager = moduleRef.get<EntityManager>(EntityManager);
    await testDataSeed(entityManager);
  });

  it('should return questions for project', async () => {
    const result = await projectQuestionsService.getQuestions(1);
    expect(result.length).toBe(2);
  });
});
