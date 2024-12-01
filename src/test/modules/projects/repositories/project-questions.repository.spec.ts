import { Test } from '@nestjs/testing';
import { ProjectQuestionsRepository } from 'src/modules/projects/repositories';
import { testDataSeed } from 'src/test/data-seed';
import { TypeOrmTestingModule } from 'src/test/type-orm-testing.module';
import { EntityManager } from 'typeorm';

describe('ProjectQuestionsRepository', () => {
  let projectQuestionsRepository: ProjectQuestionsRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmTestingModule],
      providers: [ProjectQuestionsRepository],
    }).compile();
    projectQuestionsRepository = moduleRef.get<ProjectQuestionsRepository>(
      ProjectQuestionsRepository,
    );
    const entityManager = moduleRef.get<EntityManager>(EntityManager);
    await testDataSeed(entityManager);
  });

  it('should return questions for project', async () => {
    const result = await projectQuestionsRepository.getQuestions(1);
    expect(result.length).toBe(2);
  });

  it('should return question by id', async () => {
    const result = await projectQuestionsRepository.getQuestion(1);
    expect(result).toBeDefined();
  });
});
