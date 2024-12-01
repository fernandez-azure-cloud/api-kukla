import { Test } from '@nestjs/testing';
import { ProjectAuthorizationRepository } from 'src/modules/projects/repositories';
import { ProjectAuthorizationService } from 'src/modules/projects/services';
import { RoleCode } from 'src/shared/base';
import { Role, User, UserRole } from 'src/shared/entities';
import { testDataSeed } from 'src/test/data-seed';
import { TypeOrmTestingModule } from 'src/test/type-orm-testing.module';
import { EntityManager } from 'typeorm';

describe('ProjectAuthorizationService', () => {
  let projectAuthorizationService: ProjectAuthorizationService;
  let user: User;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmTestingModule],
      providers: [ProjectAuthorizationRepository, ProjectAuthorizationService],
    }).compile();
    const entityManager = moduleRef.get<EntityManager>(EntityManager);
    await testDataSeed(entityManager);
    projectAuthorizationService = moduleRef.get<ProjectAuthorizationService>(
      ProjectAuthorizationService,
    );
  });

  describe('executive', () => {
    beforeEach(() => {
      user = new User();
      user.id = 1;
      user.userRoles = [new UserRole()];
      user.userRoles[0].role = new Role();
      user.userRoles[0].role.code = RoleCode.Executive;
    });

    it('should return true when executive has active assignment for project', async () => {
      const result = await projectAuthorizationService.getAuthorization(
        1,
        user,
      );
      expect(result).toBe(true);
    });

    it('should return false when executive not has active assignment for project', async () => {
      const result = await projectAuthorizationService.getAuthorization(
        3,
        user,
      );
      expect(result).toBe(false);
    });
  });
});
