import { Test } from '@nestjs/testing';
import { PermissionsRepository } from 'src/modules/auth/repositories';
import { testDataSeed } from 'src/test/data-seed';
import { TypeOrmTestingModule } from 'src/test/type-orm-testing.module';
import { EntityManager } from 'typeorm';

describe('PermissionsRepository', () => {
  let permissionsRepository: PermissionsRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmTestingModule],
      providers: [PermissionsRepository],
    }).compile();
    permissionsRepository = moduleRef.get<PermissionsRepository>(
      PermissionsRepository,
    );
    const entityManager = moduleRef.get<EntityManager>(EntityManager);
    await testDataSeed(entityManager);
  });

  it('should return true when has permission', async () => {
    const result = await permissionsRepository.hasPermission(
      2,
      'projects',
      'GET',
    );
    expect(result).toBe(true);
  });

  it('should return false when not has permission', async () => {
    const result = await permissionsRepository.hasPermission(2, 'users', 'GET');
    expect(result).toBe(false);
  });
});
