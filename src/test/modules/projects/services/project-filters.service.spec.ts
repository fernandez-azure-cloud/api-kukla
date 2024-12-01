import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
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

describe('ProjectFiltersService', () => {
  let projectFiltersService: ProjectFiltersService;
  let user: User;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmTestingModule, TypeOrmModule.forFeature([Project])],
      providers: [
        ProjectFiltersService,
        RegionsRepository,
        ProjectStatusRepository,
        UbicationsRepository,
        ProjectsRepository,
        AmountRangeRepository,
        ManagedUsersRepository,
      ],
    }).compile();
    projectFiltersService = moduleRef.get<ProjectFiltersService>(
      ProjectFiltersService,
    );
    const entityManager = moduleRef.get<EntityManager>(EntityManager);
    await testDataSeed(entityManager);
  });

  describe('executive', () => {
    beforeEach(() => {
      user = new User();
      user.id = 1;
      const userRole = new UserRole();
      userRole.role = new Role();
      userRole.role.code = RoleCode.Executive;
      user.userRoles = [userRole];
    });

    it('should return regions list', async () => {
      const regions = await projectFiltersService.getRegions(user);
      expect(regions.length).toBe(1);
    });

    it('should return status list', async () => {
      const regions = await projectFiltersService.getProjectStatus(user);
      expect(regions.length).toBe(1);
    });

    it('should return departments list', async () => {
      const departments = await projectFiltersService.getDepartments(user);
      expect(departments.length).toBe(1);
    });

    it('should return provinces list', async () => {
      const provinces = await projectFiltersService.getProvinces(user);
      expect(provinces.length).toBe(1);
    });

    it('should return districts list', async () => {
      const districts = await projectFiltersService.getDistricts(user);
      expect(districts.length).toBe(1);
    });

    it('should return amount ranges', async () => {
      const amountRanges = await projectFiltersService.getAmountRanges(user);
      expect(amountRanges.length).toBe(1);
    });

    it('should return date range', async () => {
      const amountRange = await projectFiltersService.getDateRange(user);
      expect(amountRange.minDate).toBeDefined();
      expect(amountRange.maxDate).toBeDefined();
    });
  });

  describe('manager', () => {
    beforeEach(() => {
      user = new User();
      user.id = 3;
      const userRole = new UserRole();
      userRole.role = new Role();
      userRole.role.code = RoleCode.Manager;
      user.userRoles = [userRole];
    });

    it('should return regions list', async () => {
      const regions = await projectFiltersService.getRegions(user);
      expect(regions.length).toBe(2);
    });

    it('should return status list', async () => {
      const regions = await projectFiltersService.getProjectStatus(user);
      expect(regions.length).toBe(1);
    });

    it('should return departments list', async () => {
      const departments = await projectFiltersService.getDepartments(user);
      expect(departments.length).toBe(1);
    });

    it('should return provinces list', async () => {
      const provinces = await projectFiltersService.getProvinces(user);
      expect(provinces.length).toBe(1);
    });

    it('should return districts list', async () => {
      const districts = await projectFiltersService.getDistricts(user);
      expect(districts.length).toBe(1);
    });

    it('should return amount ranges', async () => {
      const amountRanges = await projectFiltersService.getAmountRanges(user);
      expect(amountRanges.length).toBe(1);
    });

    it('should return date range', async () => {
      const amountRange = await projectFiltersService.getDateRange(user);
      expect(amountRange.minDate).toBeDefined();
      expect(amountRange.maxDate).toBeDefined();
    });
  });

  describe('administrator', () => {
    beforeEach(() => {
      user = new User();
      user.id = 4;
      const userRole = new UserRole();
      userRole.role = new Role();
      userRole.role.code = RoleCode.Administrator;
      user.userRoles = [userRole];
    });

    it('should return regions list', async () => {
      const regions = await projectFiltersService.getRegions(user);
      expect(regions.length).toBe(2);
    });

    it('should return status list', async () => {
      const regions = await projectFiltersService.getProjectStatus(user);
      expect(regions.length).toBe(7);
    });

    it('should return departments list', async () => {
      const departments = await projectFiltersService.getDepartments(user);
      expect(departments.length).toBe(2);
    });

    it('should return provinces list', async () => {
      const provinces = await projectFiltersService.getProvinces(user);
      expect(provinces.length).toBe(2);
    });

    it('should return districts list', async () => {
      const districts = await projectFiltersService.getDistricts(user);
      expect(districts.length).toBe(2);
    });

    it('should return amount ranges', async () => {
      const amountRanges = await projectFiltersService.getAmountRanges(user);
      expect(amountRanges.length).toBe(5);
    });

    it('should return date range', async () => {
      const amountRange = await projectFiltersService.getDateRange(user);
      expect(amountRange.minDate).toBeDefined();
      expect(amountRange.maxDate).toBeDefined();
    });
  });
});
