import { Test } from '@nestjs/testing';
import { ManagedUsersRepository } from 'src/modules/projects/repositories';
import { testDataSeed } from 'src/test/data-seed';
import { TypeOrmTestingModule } from 'src/test/type-orm-testing.module';
import { EntityManager } from 'typeorm';

describe('ManagedUsersRepository', () => {
  let managedUsersRepository: ManagedUsersRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmTestingModule],
      providers: [ManagedUsersRepository],
    }).compile();
    const entityManager = moduleRef.get<EntityManager>(EntityManager);
    await testDataSeed(entityManager);
    managedUsersRepository = moduleRef.get<ManagedUsersRepository>(
      ManagedUsersRepository,
    );
  });

  it('should return managed users', async () => {
    const result = await managedUsersRepository.getManagedUsers(5);
    expect(result.length).toBe(2);
  });
});
