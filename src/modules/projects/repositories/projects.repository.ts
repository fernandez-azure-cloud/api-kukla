import { Injectable, NotFoundException } from '@nestjs/common';
import { AmountRange, Project } from 'src/shared/entities';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import {
  AmountRangeDto,
  DateRangeDto,
  GetProjectsQueryDto,
  ProjectListDto,
} from '../dtos';
import {
  FilterType,
  WITHOUT_ASSIGNED_PROJECTS_MESSAGE,
  WITHOUT_FILTER_PROJECTS_MESSAGE,
  WITHOUT_PROJECT_MESSAGE,
  WITHOUT_SEARCH_PROJECTS_MESSAGE,
} from 'src/shared/base';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProjectsRepository {
  constructor(
    protected readonly entityManager: EntityManager,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async getProject(projectId: number): Promise<Project> {
    const queryBuilder = this.entityManager.connection
      .createQueryBuilder(Project, 'project')
      .leftJoinAndSelect('project.status', 'status')
      .leftJoinAndSelect('project.office', 'office')
      .leftJoinAndSelect('office.region', 'region')
      .leftJoinAndSelect('project.district', 'district')
      .leftJoinAndSelect('district.province', 'province')
      .leftJoinAndSelect('province.department', 'department')
      .leftJoinAndSelect('project.financialUnit', 'financial_unit')
      .leftJoinAndSelect('financial_unit.organization', 'organization')
      .leftJoinAndSelect('project.speciality', 'speciality')
      .leftJoinAndSelect('project.lastStudy', 'last_study')
      .leftJoinAndSelect('project.feasibilityLevel', 'feasibility_level')
      .leftJoinAndSelect('project.currency', 'currency')
      .leftJoinAndSelect(
        'project.projectAssignments',
        'project_assignment',
        'project_assignment.active = :active',
        { active: true },
      )
      .where('project.id = :projectId', { projectId })
      .select([
        'project.id',
        'project.name',
        'project.description',
        'speciality.name',
        'project.uniqueInvestmentCode',
        'status.code',
        'status.description',
        'office.id',
        'office.name',
        'region.id',
        'region.name',
        'district.name',
        'province.name',
        'department.name',
        'project.viableAmount',
        'project_assignment.createdAt',
        'financial_unit.id',
        'financial_unit.name',
        'project.priority',
        'project.updatedAmount',
        'last_study.name',
        'feasibility_level.name',
        'project.feasibilityDate',
        'organization.name',
        'currency.isoCode',
      ]);

    const project = await queryBuilder.getOne();

    if (!project) {
      throw new NotFoundException();
    }

    return project;
  }

  getProjectStatus(projectId: number): Promise<Project> {
    const qb = this.entityManager.connection
      .createQueryBuilder(Project, 'project')
      .leftJoinAndSelect('project.status', 'status')
      .select(['project.id', 'project.status', 'status.code'])
      .where('project.id = :projectId', { projectId });

    return qb.getOne();
  }

  async getAssignedProjects(
    userId: number,
    query: GetProjectsQueryDto,
  ): Promise<ProjectListDto> {
    try {
      return await this.getProjects(query, (qb) =>
        qb.andWhere('project_assignment.userId = :userId', {
          userId: userId,
        }),
      );
    } catch (error) {
      if (error instanceof NotFoundException && !query.type) {
        throw new NotFoundException(WITHOUT_ASSIGNED_PROJECTS_MESSAGE);
      }

      throw error;
    }
  }

  async getManagedProjects(
    userId: number,
    query: GetProjectsQueryDto,
  ): Promise<ProjectListDto> {
    const projects = await this.getProjects(query, (queryBuilder) => {
      return queryBuilder
        .leftJoinAndSelect('region.userRegions', 'user_region')
        .addSelect(['executive.id', 'executive.name', 'executive.firstSurname'])
        .andWhere('user_region.userId = :userId', { userId: userId });
    });
    projects.showExecutive = true;
    return projects;
  }

  async getProjects(
    query: GetProjectsQueryDto,
    queryBuilderFn?: (
      qb: SelectQueryBuilder<Project>,
    ) => SelectQueryBuilder<Project>,
  ): Promise<ProjectListDto> {
    let queryBuilder = this.entityManager.connection
      .createQueryBuilder(Project, 'project')
      .leftJoinAndSelect('project.status', 'status')
      .leftJoinAndSelect('project.office', 'office')
      .leftJoinAndSelect('office.region', 'region')
      .leftJoinAndSelect('project.district', 'district')
      .leftJoinAndSelect('district.province', 'province')
      .leftJoinAndSelect('province.department', 'department')
      .leftJoinAndSelect('project.financialUnit', 'financial_unit')
      .leftJoinAndSelect('financial_unit.organization', 'organization')
      .leftJoinAndSelect(
        'project.projectAssignments',
        'project_assignment',
        'project_assignment.active = :active',
        { active: true },
      )
      .leftJoinAndSelect('project.currency', 'currency')
      .leftJoinAndSelect('project_assignment.user', 'executive')
      .orderBy(query.orderColumn, query.orderDirection)
      .take(query.pageSize)
      .skip(query.pageIndex * query.pageSize)
      .select([
        'project.id',
        'project.name',
        'project.uniqueInvestmentCode',
        'status.code',
        'status.description',
        'office.id',
        'region.id',
        'region.name',
        'district.name',
        'province.name',
        'department.name',
        'project.viableAmount',
        'project_assignment.createdAt',
        'financial_unit.id',
        'organization.name',
        'currency.isoCode',
      ]);

    if (query.executive) {
      queryBuilder.andWhere('project_assignment.userId in (:...executiveId)', {
        executiveId: query.executive,
      });
    }

    if (query.status) {
      queryBuilder.andWhere('status.id in (:...statusId)', {
        statusId: query.status,
      });
    }

    if (query.region) {
      queryBuilder.andWhere('region.id in (:...regionId)', {
        regionId: query.region,
      });
    }

    if (query.department) {
      queryBuilder.andWhere('department.id in (:...departmentId)', {
        departmentId: query.department,
      });
    }

    if (query.province) {
      queryBuilder.andWhere('province.id in (:...provinceId)', {
        provinceId: query.province,
      });
    }

    if (query.amountRange) {
      queryBuilder
        .leftJoin(
          AmountRange,
          'amount_range',
          '(amount_range.minAmount is null or project.viableAmount >= amount_range.minAmount) and (amount_range.maxAmount is null or project.viableAmount <= amount_range.maxAmount)',
        )
        .andWhere('amount_range.id in (:...amountRangeId)', {
          amountRangeId: query.amountRange,
        });
    }

    if (query.minDate) {
      queryBuilder.andWhere('project_assignment.createdAt >= :minDate::date', {
        minDate: query.minDate,
      });
    }

    if (query.maxDate) {
      queryBuilder.andWhere(
        "project_assignment.createdAt < (:maxDate::date + '1 day'::interval)",
        {
          maxDate: query.maxDate,
        },
      );
    }

    if (query.search) {
      queryBuilder.andWhere(
        '(lower(project.name) like lower(:search) or lower(project.uniqueInvestmentCode) like lower(:search))',
        { search: `%${query.search}%` },
      );
    }

    if (queryBuilderFn) {
      queryBuilder = queryBuilderFn(queryBuilder);
    }
    const [projects, total] = await queryBuilder.getManyAndCount();

    if (projects.length === 0) {
      switch (query.type) {
        case FilterType.Search:
          throw new NotFoundException(
            WITHOUT_SEARCH_PROJECTS_MESSAGE.replace('$1', query.search),
          );

        case FilterType.Filter:
          throw new NotFoundException(WITHOUT_FILTER_PROJECTS_MESSAGE);

        default:
          throw new NotFoundException(WITHOUT_PROJECT_MESSAGE);
      }
    }

    return {
      total: total,
      items: projects,
      pageIndex: query.pageIndex,
      pageSize: query.pageSize,
      showExecutive: false,
      totalPages: Math.ceil(total / query.pageSize),
    };
  }

  async getAssignedAmountRange(userId: number): Promise<AmountRangeDto> {
    return this.getAmountRange((qb) =>
      qb
        .leftJoin('project.projectAssignments', 'project_assignment')
        .where('project_assignment.active = :active', { active: true })
        .andWhere('project_assignment.userId = :userId', { userId: userId }),
    );
  }

  getManagedAmountRange(userId: number): Promise<AmountRangeDto> {
    return this.getAmountRange((qb) =>
      qb
        .leftJoin('project.office', 'office')
        .leftJoin('office.region', 'region')
        .leftJoin('region.userRegions', 'user_region')
        .where('user_region.userId = :userId', { userId: userId }),
    );
  }

  private async getAmountRange(
    queryBuilderFn: (
      qb: SelectQueryBuilder<Project>,
    ) => SelectQueryBuilder<Project>,
  ): Promise<AmountRangeDto> {
    let queryBuilder = this.entityManager.connection
      .createQueryBuilder(Project, 'project')
      .select([])
      .addSelect('MAX(project.viableAmount)', 'maxAmount')
      .addSelect('MIN(project.viableAmount)', 'minAmount');

    queryBuilder = queryBuilderFn(queryBuilder);
    const result = await queryBuilder.getRawOne();
    return {
      minAmount: result.minAmount < result.maxAmount ? result.minAmount : 0,
      maxAmount: result.maxAmount,
    };
  }

  async getAssignedDateRange(userId: number): Promise<DateRangeDto> {
    return this.getDateRange((qb) =>
      qb.andWhere('project_assignment.userId = :userId', { userId: userId }),
    );
  }

  getManagedDateRange(userId: number): Promise<DateRangeDto> {
    return this.getDateRange((qb) =>
      qb
        .leftJoin('project.office', 'office')
        .leftJoin('office.region', 'region')
        .leftJoin('region.userRegions', 'user_region')
        .where('user_region.userId = :userId', { userId: userId }),
    );
  }

  async getDateRange(
    queryBuilderFn?: (
      qb: SelectQueryBuilder<Project>,
    ) => SelectQueryBuilder<Project>,
  ): Promise<DateRangeDto> {
    let queryBuilder = this.entityManager.connection
      .createQueryBuilder(Project, 'project')
      .leftJoin('project.projectAssignments', 'project_assignment')
      .select([])
      .addSelect('MAX(project_assignment.createdAt)', 'maxDate')
      .addSelect('MIN(project_assignment.createdAt)', 'minDate')
      .where('project_assignment.active = :active', { active: true });

    if (queryBuilderFn) {
      queryBuilder = queryBuilderFn(queryBuilder);
    }
    return queryBuilder.getRawOne();
  }

  updateProject(project: Project): Promise<Project> {
    return this.projectRepository.save(project);
  }

  async getProjectForNotification(projectId: number): Promise<Project> {
    const queryBuilder = this.entityManager.connection
      .createQueryBuilder(Project, 'project')
      .leftJoinAndSelect('project.status', 'status')
      .leftJoinAndSelect('project.office', 'office')
      .leftJoinAndSelect('office.region', 'region')
      .leftJoinAndSelect('project.district', 'district')
      .leftJoinAndSelect('district.province', 'province')
      .leftJoinAndSelect('province.department', 'department')
      .leftJoinAndSelect('project.financialUnit', 'financial_unit')
      .leftJoinAndSelect('financial_unit.organization', 'organization')
      .leftJoinAndSelect('project.speciality', 'speciality')
      .leftJoinAndSelect('project.lastStudy', 'last_study')
      .leftJoinAndSelect('project.feasibilityLevel', 'feasibility_level')
      .leftJoinAndSelect('project.currency', 'currency')
      .leftJoinAndSelect('region.userRegions', 'manager_region')
      .leftJoinAndSelect('manager_region.user', 'manager')
      .leftJoinAndSelect(
        'project.projectAssignments',
        'project_assignment',
        'project_assignment.active = :active',
        { active: true },
      )
      .leftJoinAndSelect('project_assignment.user', 'executive')
      .where('project.id = :projectId', { projectId })
      .select([
        'project.id',
        'project.name',
        'project.uniqueInvestmentCode',
        'manager_region.userId',
        'manager.name',
        'manager.firstSurname',
        'manager.lastSurname',
        'manager.email',
        'project_assignment.id',
        'executive.name',
        'executive.firstSurname',
        'executive.lastSurname',
        'status.description',
        'office.name',
        'region.name',
        'district.name',
        'province.name',
        'department.name',
        'project.viableAmount',
        'financial_unit.name',
        'organization.name',
        'currency.isoCode',
      ]);

    const project = await queryBuilder.getOne();

    if (!project) {
      throw new NotFoundException();
    }

    return project;
  }
}
