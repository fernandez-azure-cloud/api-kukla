import { Test } from '@nestjs/testing';
import { UbicationsRepository } from 'src/modules/projects/repositories';
import { testDataSeed } from 'src/test/data-seed';
import { TypeOrmTestingModule } from 'src/test/type-orm-testing.module';
import { EntityManager } from 'typeorm';

describe('UbicationsRepository', () => {
  let ubicationsRepository: UbicationsRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmTestingModule],
      providers: [UbicationsRepository],
    }).compile();
    ubicationsRepository =
      moduleRef.get<UbicationsRepository>(UbicationsRepository);
    const entityManager = moduleRef.get<EntityManager>(EntityManager);
    await testDataSeed(entityManager);
  });

  describe('departments', () => {
    it('should return departments for executive', async () => {
      const departments = await ubicationsRepository.getAssignedDepartments(1);
      expect(departments.length).toBe(1);
    });

    it('should return departments for manager', async () => {
      const departments = await ubicationsRepository.getManagedDepartments(3);
      expect(departments.length).toBe(1);
    });
  });

  describe('provinces', () => {
    it('should return provinces for executive', async () => {
      const provinces = await ubicationsRepository.getAssignedProvinces(1);
      expect(provinces.length).toBe(1);
    });

    it('should return provinces for manager', async () => {
      const provinces = await ubicationsRepository.getManagedProvinces(3);
      expect(provinces.length).toBe(1);
    });
  });

  describe('districts', () => {
    it('should return districts for executive', async () => {
      const districts = await ubicationsRepository.getAssignedDistricts(1);
      expect(districts.length).toBe(1);
    });

    it('should return districts for manager', async () => {
      const districts = await ubicationsRepository.getManagedDistricts(3);
      expect(districts.length).toBe(1);
    });
  });
});
