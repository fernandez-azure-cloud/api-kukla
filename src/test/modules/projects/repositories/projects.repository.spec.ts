import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetProjectsQueryDto } from 'src/modules/projects/dtos';
import { ProjectsRepository } from 'src/modules/projects/repositories';
import {
  FilterType,
  WITHOUT_ASSIGNED_PROJECTS_MESSAGE,
  WITHOUT_FILTER_PROJECTS_MESSAGE,
  WITHOUT_SEARCH_PROJECTS_MESSAGE,
} from 'src/shared/base';
import { Project } from 'src/shared/entities';
import { testDataSeed } from 'src/test/data-seed';
import { TypeOrmTestingModule } from 'src/test/type-orm-testing.module';
import { EntityManager } from 'typeorm';

describe('ProjectsRepository', () => {
  let projectsRepository: ProjectsRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmTestingModule, TypeOrmModule.forFeature([Project])],
      providers: [ProjectsRepository],
    }).compile();
    projectsRepository = moduleRef.get<ProjectsRepository>(ProjectsRepository);
    const entityManager = moduleRef.get<EntityManager>(EntityManager);
    await testDataSeed(entityManager);
  });

  describe('projects', () => {
    it('should list projects for executive', async () => {
      const query = {
        pageSize: 10,
        pageIndex: 0,
        orderColumn: 'project.name',
        orderDirection: 'ASC',
      } as GetProjectsQueryDto;
      const result = await projectsRepository.getAssignedProjects(1, query);
      expect(result.total).toBe(2);
    });

    it('should list filtered projects for executive', async () => {
      const query = {
        pageSize: 10,
        pageIndex: 0,
        orderColumn: 'project.name',
        orderDirection: 'ASC',
        status: [2],
        region: [1, 2],
        department: [1],
        province: [1],
        amountRange: [5],
      } as GetProjectsQueryDto;
      const result = await projectsRepository.getAssignedProjects(1, query);
      expect(result.total).toBe(2);
    });

    it('should list projects for manager', async () => {
      const query = {
        pageSize: 10,
        pageIndex: 0,
        orderColumn: 'project.name',
        orderDirection: 'ASC',
      } as GetProjectsQueryDto;
      const result = await projectsRepository.getManagedProjects(3, query);
      expect(result.total).toBe(3);
    });
  });

  describe('projects empty result', () => {
    it('should return message for search', async () => {
      const query = {
        type: FilterType.Search,
        search: 'asdfg',
        pageSize: 10,
        pageIndex: 0,
        orderColumn: 'project.name',
        orderDirection: 'ASC',
        status: [2],
        region: [1, 2],
        department: [1],
        province: [1],
        amountRange: [5],
      } as GetProjectsQueryDto;
      try {
        await projectsRepository.getAssignedProjects(1, query);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual(
          WITHOUT_SEARCH_PROJECTS_MESSAGE.replace('$1', 'asdfg'),
        );
      }
    });

    it('should return message for filter', async () => {
      const query = {
        type: FilterType.Filter,
        search: '',
        pageSize: 10,
        pageIndex: 0,
        orderColumn: 'project.name',
        orderDirection: 'ASC',
        status: [1],
        region: [1, 2],
        department: [1],
        province: [1],
        amountRange: [5],
      } as GetProjectsQueryDto;
      try {
        await projectsRepository.getAssignedProjects(1, query);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual(WITHOUT_FILTER_PROJECTS_MESSAGE);
      }
    });

    it('should return message for user without assignments', async () => {
      const query = {
        pageIndex: 0,
        pageSize: 10,
      } as GetProjectsQueryDto;
      try {
        await projectsRepository.getAssignedProjects(4, query);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual(WITHOUT_ASSIGNED_PROJECTS_MESSAGE);
      }
    });
  });

  describe('filters', () => {
    it('should return amount range for executive', async () => {
      const result = await projectsRepository.getAssignedAmountRange(1);
      expect(result.minAmount).toBeLessThan(result.maxAmount);
    });

    it('should return date range for executive', async () => {
      const result = await projectsRepository.getAssignedDateRange(1);
      expect(result.minDate).toBeDefined();
      expect(result.maxDate).toBeDefined();
    });

    it('should return amount range for manager', async () => {
      const result = await projectsRepository.getManagedAmountRange(1);
      expect(result.minAmount).toBeLessThan(result.maxAmount);
    });

    it('should return date range for manager', async () => {
      const result = await projectsRepository.getManagedDateRange(1);
      expect(result.minDate).toBeDefined();
      expect(result.maxDate).toBeDefined();
    });
  });

  describe('project detail', () => {
    it('should return project detail', async () => {
      const result = await projectsRepository.getProject(1);
      expect(result).toBeInstanceOf(Project);
      expect(result.id).toEqual(1);
    });

    it('should throw not found exception', () => {
      expect(async () => {
        await projectsRepository.getProject(10);
      }).rejects.toThrow(NotFoundException);
    });
  });
});
