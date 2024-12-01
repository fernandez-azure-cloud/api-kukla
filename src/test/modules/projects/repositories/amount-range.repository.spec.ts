import { Test } from '@nestjs/testing';
import { AmountRangeRepository } from 'src/modules/projects/repositories';
import { testDataSeed } from 'src/test/data-seed';
import { TypeOrmTestingModule } from 'src/test/type-orm-testing.module';
import { EntityManager } from 'typeorm';

describe('AmountRangeRepository', () => {
  let amountRangeRepository: AmountRangeRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmTestingModule],
      providers: [AmountRangeRepository],
    }).compile();
    const entityManager = moduleRef.get<EntityManager>(EntityManager);
    await testDataSeed(entityManager);
    amountRangeRepository = moduleRef.get<AmountRangeRepository>(
      AmountRangeRepository,
    );
  });

  it('should return amount ranges for executive', async () => {
    const ranges = await amountRangeRepository.getAssignedAmountRanges(1);
    expect(ranges.length).toEqual(1);
  });
});
