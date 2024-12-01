import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectStatusChangeRepository } from 'src/modules/projects/repositories';
import { Project, ProjectStatusChange } from 'src/shared/entities';
import { ProjectStatus } from 'src/shared/entities/project-status.entity';
import { testDataSeed } from 'src/test/data-seed';
import { TypeOrmTestingModule } from 'src/test/type-orm-testing.module';
import { EntityManager } from 'typeorm';

describe('ProjectStatusChangeRepository', () => {
  let projectStatusChangeRepository: ProjectStatusChangeRepository;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmTestingModule,
        TypeOrmModule.forFeature([ProjectStatusChange]),
      ],
      providers: [ProjectStatusChangeRepository],
    }).compile();
    entityManager = moduleRef.get<EntityManager>(EntityManager);
    await testDataSeed(entityManager);
    projectStatusChangeRepository =
      moduleRef.get<ProjectStatusChangeRepository>(
        ProjectStatusChangeRepository,
      );
  });

  it('should insert project status change', async () => {
    const before = await entityManager.connection
      .createQueryBuilder(ProjectStatusChange, 'psc')
      .getCount();
    expect(before).toBe(0);
    const change = new ProjectStatusChange();
    change.project = { id: 1 } as Project;
    change.status = { id: 3 } as ProjectStatus;
    await projectStatusChangeRepository.addProjectStatusChange(change);
    const after = await entityManager.connection
      .createQueryBuilder(ProjectStatusChange, 'psc')
      .getCount();
    expect(after).toBe(1);
  });
});
