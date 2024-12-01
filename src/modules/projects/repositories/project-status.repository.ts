import { Injectable } from '@nestjs/common';
import { ProjectStatusCode } from 'src/shared/base';
import { ProjectStatus } from 'src/shared/entities/project-status.entity';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class ProjectStatusRepository {
  constructor(private readonly entityManager: EntityManager) {}

  getAssignedProjectStatus(userId: number): Promise<ProjectStatus[]> {
    return this.getProjectStatus((qb) =>
      qb
        .leftJoinAndSelect('project.projectAssignments', 'project_assignment')
        .where('project_assignment.userId = :userId', { userId: userId })
        .andWhere('project_assignment.active = :active', { active: true }),
    );
  }

  getManagedProjectStatus(userId: number): Promise<ProjectStatus[]> {
    return this.getProjectStatus((qb) =>
      qb
        .leftJoinAndSelect('project.office', 'office')
        .leftJoinAndSelect('office.region', 'region')
        .leftJoinAndSelect('region.userRegions', 'user_region')
        .where('user_region.userId = :userId', { userId: userId }),
    );
  }

  getProjectStatus(
    queryBuilderFn?: (
      qb: SelectQueryBuilder<ProjectStatus>,
    ) => SelectQueryBuilder<ProjectStatus>,
  ): Promise<ProjectStatus[]> {
    let queryBuilder = this.entityManager.connection
      .createQueryBuilder(ProjectStatus, 'project_status')
      .leftJoinAndSelect('project_status.projects', 'project')
      .select([
        'project_status.id',
        'project_status.code',
        'project_status.description',
      ]);

    if (queryBuilderFn) {
      queryBuilder = queryBuilderFn(queryBuilder);
    }
    return queryBuilder.getMany();
  }

  getStatusByCode(code: ProjectStatusCode): Promise<ProjectStatus> {
    return this.entityManager.connection
      .createQueryBuilder(ProjectStatus, 'project_status')
      .where('project_status.code = :code', { code })
      .getOne();
  }
}
