import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectFiltersController } from 'src/modules/projects/controllers';
import {
  AmountRangeRepository,
  ManagedUsersRepository,
  ProjectStatusRepository,
  ProjectsRepository,
  RegionsRepository,
  UbicationsRepository,
} from 'src/modules/projects/repositories';
import { ProjectFiltersService } from 'src/modules/projects/services';
import { RoleCode } from 'src/shared/base';
import { Project, Role, User, UserRole } from 'src/shared/entities';
import { testDataSeed } from 'src/test/data-seed';
import { TypeOrmTestingModule } from 'src/test/type-orm-testing.module';
import { EntityManager } from 'typeorm';

describe('ProjectFiltersController', () => {
  let projectFiltersController: ProjectFiltersController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmTestingModule, TypeOrmModule.forFeature([Project])],
      controllers: [ProjectFiltersController],
      providers: [
        ProjectFiltersService,
        ProjectStatusRepository,
        RegionsRepository,
        UbicationsRepository,
        ProjectsRepository,
        AmountRangeRepository,
        ManagedUsersRepository,
      ],
    }).compile();
    projectFiltersController = moduleRef.get<ProjectFiltersController>(
      ProjectFiltersController,
    );
    const entityManager = await moduleRef.get<EntityManager>(EntityManager);
    await testDataSeed(entityManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('executive', () => {
    let user: User;

    beforeEach(() => {
      user = new User();
      user.id = 1;
      user.userRoles = [new UserRole()];
      user.userRoles[0].role = new Role();
      user.userRoles[0].role.code = RoleCode.Executive;
    });

    it('should return filters', async () => {
      const filters = await projectFiltersController.getFilters(user);
      expect(filters.amountRanges).toBeDefined();
      expect(filters.dateRange).toBeDefined();
      expect(filters.regions.length).toBeGreaterThan(0);
      expect(filters.status.length).toBeGreaterThan(0);
      expect(filters.departments.length).toBeGreaterThan(0);
      expect(filters.provinces.length).toBeGreaterThan(0);
      expect(filters.districts.length).toBeGreaterThan(0);
    });

    it('should list status', async () => {
      const status = await projectFiltersController.getProjectStatus(user);
      expect(status.length).toBe(1);
    });

    it('should list regions', async () => {
      const regions = await projectFiltersController.getProjectRegions(user);
      expect(regions.length).toBe(1);
    });

    it('should list departments', async () => {
      const departments =
        await projectFiltersController.getProjectDepartments(user);
      expect(departments.length).toBe(1);
    });

    it('should list provinces', async () => {
      const provinces =
        await projectFiltersController.getProjectProvinces(user);
      expect(provinces.length).toBe(1);
    });

    it('should list districts', async () => {
      const districts =
        await projectFiltersController.getProjectDistricts(user);
      expect(districts.length).toBe(1);
    });

    it('should return amount ranges', async () => {
      const amountRanges =
        await projectFiltersController.getProjectAmountRange(user);
      expect(amountRanges.length).toBe(1);
    });

    it('should return date range', async () => {
      const dateRange =
        await projectFiltersController.getProjectDateRange(user);
      expect(dateRange.minDate).toBeDefined();
      expect(dateRange.maxDate).toBeDefined();
    });
  });
});
