import { Test } from '@nestjs/testing';
import { RegionsRepository } from 'src/modules/projects/repositories';
import { testDataSeed } from 'src/test/data-seed';
import { TypeOrmTestingModule } from 'src/test/type-orm-testing.module';
import { EntityManager } from 'typeorm';

describe('RegionsRepository', () => {
  let regionsRepository: RegionsRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmTestingModule],
      providers: [RegionsRepository],
    }).compile();
    regionsRepository = moduleRef.get<RegionsRepository>(RegionsRepository);
    const entityManager = moduleRef.get<EntityManager>(EntityManager);
    await testDataSeed(entityManager);
  });

  it('should return regions for executive', async () => {
    const regions = await regionsRepository.getAssignedProjectRegions(1);
    expect(regions.length).toBe(1);
  });

  it('should return regions for manager', async () => {
    const regions = await regionsRepository.getManagedProjectRegions(3);
    expect(regions.length).toBe(2);
  });
});
