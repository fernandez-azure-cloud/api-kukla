import { ExecutionContext } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { ProjectGuard } from 'src/modules/projects/guards';
import { ProjectAuthorizationRepository } from 'src/modules/projects/repositories';
import { ProjectAuthorizationService } from 'src/modules/projects/services';
import { RoleCode } from 'src/shared/base';
import { testDataSeed } from 'src/test/data-seed';
import { TypeOrmTestingModule } from 'src/test/type-orm-testing.module';
import { EntityManager } from 'typeorm';

describe('ProjectGuard', () => {
  let projectGuard: ProjectGuard;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, TypeOrmTestingModule],
      providers: [
        ProjectAuthorizationService,
        ProjectAuthorizationRepository,
        { provide: APP_GUARD, useClass: ProjectGuard },
      ],
    }).compile();
    const entityManager = moduleRef.get<EntityManager>(EntityManager);
    await testDataSeed(entityManager);
    projectGuard = moduleRef.get<ProjectGuard>(ProjectGuard);
  });

  it('should prevent access for not assigned projects', async () => {
    const contextMock = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: {
            id: 1,
            role: { code: RoleCode.Executive },
          },
          params: {
            id: 1,
          },
          query: {
            projectId: 3,
          },
        }),
      }),
    } as ExecutionContext;
    const result = await projectGuard.canActivate(contextMock);
    expect(result).toBe(false);
  });
});
