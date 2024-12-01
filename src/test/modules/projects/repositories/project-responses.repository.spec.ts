import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectResponsesRepository } from 'src/modules/projects/repositories';
import { Response, User } from 'src/shared/entities';
import { testDataSeed } from 'src/test/data-seed';
import { TypeOrmTestingModule } from 'src/test/type-orm-testing.module';
import { EntityManager } from 'typeorm';

describe('ProjectResponsesRepository', () => {
  let projectResponsesRepository: ProjectResponsesRepository;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmTestingModule, TypeOrmModule.forFeature([Response])],
      providers: [ProjectResponsesRepository],
    }).compile();
    entityManager = moduleRef.get<EntityManager>(EntityManager);
    await testDataSeed(entityManager);
    projectResponsesRepository = moduleRef.get<ProjectResponsesRepository>(
      ProjectResponsesRepository,
    );
  });

  it('should save responses', async () => {
    const responses = [
      {
        text: null,
        questionOptionId: 1,
        projectAssignmentId: 1,
        questionId: 1,
      },
      {
        text: null,
        questionOptionId: 1,
        projectAssignmentId: 1,
        questionId: 2,
      },
    ] as Response[];
    const qb = entityManager.connection
      .createQueryBuilder(Response, 'response')
      .select([]);
    const beforeCount = await qb.getCount();
    expect(beforeCount).toBe(0);
    await projectResponsesRepository.saveResponses(responses);
    const afterCount = await qb.getCount();
    expect(afterCount).toBe(responses.length);
  });

  it('should inactive responses', async () => {
    const responses = [
      {
        text: null,
        questionOptionId: 1,
        projectAssignmentId: 1,
        questionId: 1,
      },
      {
        text: null,
        questionOptionId: 1,
        projectAssignmentId: 1,
        questionId: 2,
      },
    ] as Response[];
    let qb = entityManager.connection
      .createQueryBuilder(Response, 'response')
      .select([]);
    await projectResponsesRepository.saveResponses(responses);
    await projectResponsesRepository.inactiveResponses(1, { id: 1 } as User);
    const allCount = await qb.getCount();
    expect(allCount).toBe(responses.length);
    qb = qb.where('response.active = true');
    const activeCount = await qb.getCount();
    expect(activeCount).toBe(0);
  });
});
