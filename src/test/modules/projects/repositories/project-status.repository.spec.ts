import { Test } from '@nestjs/testing';
import { ProjectStatusRepository } from 'src/modules/projects/repositories';
import { ProjectStatusCode } from 'src/shared/base';
import { ProjectStatus } from 'src/shared/entities/project-status.entity';
import { testDataSeed } from 'src/test/data-seed';
import { TypeOrmTestingModule } from 'src/test/type-orm-testing.module';
import { EntityManager } from 'typeorm';

describe('ProjectStatusRepository', () => {
  let projectStatusRepository: ProjectStatusRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmTestingModule],
      providers: [ProjectStatusRepository],
    }).compile();
    const entityManager = moduleRef.get<EntityManager>(EntityManager);
    await testDataSeed(entityManager);
    projectStatusRepository = moduleRef.get<ProjectStatusRepository>(
      ProjectStatusRepository,
    );
  });

  it('should return project status for executive', async () => {
    const status = await projectStatusRepository.getAssignedProjectStatus(1);
    expect(status.length).toEqual(1);
  });

  it('should return project status for manager', async () => {
    const status = await projectStatusRepository.getManagedProjectStatus(3);
    expect(status.length).toEqual(1);
  });

  it('should return project status by code', async () => {
    const status = await projectStatusRepository.getStatusByCode(
      ProjectStatusCode.Completed,
    );
    expect(status).toBeInstanceOf(ProjectStatus);
    expect(status.code).toBe(ProjectStatusCode.Completed);
  });
});
