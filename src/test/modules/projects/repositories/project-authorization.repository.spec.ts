import { Test } from '@nestjs/testing';
import { ProjectAuthorizationRepository } from 'src/modules/projects/repositories';
import { RoleCode } from 'src/shared/base';
import { Role, User, UserRole } from 'src/shared/entities';
import { testDataSeed } from 'src/test/data-seed';
import { TypeOrmTestingModule } from 'src/test/type-orm-testing.module';
import { EntityManager } from 'typeorm';

describe('ProjectAuthorizationRepository', () => {
  let projectAuthorizationRepository: ProjectAuthorizationRepository;
  let user: User;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmTestingModule],
      providers: [ProjectAuthorizationRepository],
    }).compile();
    const entityManager = moduleRef.get<EntityManager>(EntityManager);
    await testDataSeed(entityManager);
    projectAuthorizationRepository =
      moduleRef.get<ProjectAuthorizationRepository>(
        ProjectAuthorizationRepository,
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
      const result = await projectAuthorizationRepository.canShowProject(
        1,
        user,
      );
      expect(result).toBe(true);
    });

    it('should return false when executive not has active assignment for project', async () => {
      const result = await projectAuthorizationRepository.canShowProject(
        3,
        user,
      );
      expect(result).toBe(false);
    });
  });

  describe('manager', () => {
    beforeEach(() => {
      user = new User();
      user.id = 5;
      user.userRoles = [new UserRole()];
      user.userRoles[0].role = new Role();
      user.userRoles[0].role.code = RoleCode.Manager;
    });

    it('should return true when has managed project', async () => {
      const result = await projectAuthorizationRepository.canShowProject(
        1,
        user,
      );
      expect(result).toBe(true);
    });
  });
});
