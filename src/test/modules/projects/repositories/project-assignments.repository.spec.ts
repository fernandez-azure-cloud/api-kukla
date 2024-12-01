import { Test } from '@nestjs/testing';
import { ProjectAssignmentsRepository } from 'src/modules/projects/repositories';
import { testDataSeed } from 'src/test/data-seed';
import { TypeOrmTestingModule } from 'src/test/type-orm-testing.module';
import { EntityManager } from 'typeorm';

describe('ProjectAssignmentsRepository', () => {
  let projectAssignmentsRepository: ProjectAssignmentsRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmTestingModule],
      providers: [ProjectAssignmentsRepository],
    }).compile();
    const entityManager = moduleRef.get<EntityManager>(EntityManager);
    await testDataSeed(entityManager);
    projectAssignmentsRepository = moduleRef.get<ProjectAssignmentsRepository>(
      ProjectAssignmentsRepository,
    );
  });

  it('should return current assignment', async () => {
    const assigment = await projectAssignmentsRepository.getActiveAssignment(1);
    expect(assigment).toBeDefined();
  });
});
