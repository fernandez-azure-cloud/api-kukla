import { Injectable } from '@nestjs/common';
import { Region } from 'src/shared/entities';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class RegionsRepository {
  constructor(private readonly entityManager: EntityManager) {}

  getAssignedProjectRegions(userId: number): Promise<Region[]> {
    return this.getProjectRegions((qb) => {
      qb.leftJoinAndSelect('project.projectAssignments', 'project_assignment')
        .where('project_assignment.userId = :userId', { userId: userId })
        .andWhere('project_assignment.active = :active', { active: true });
      return qb;
    });
  }

  getManagedProjectRegions(userId: number): Promise<Region[]> {
    return this.getProjectRegions((qb) =>
      qb
        .leftJoinAndSelect('region.userRegions', 'user_region')
        .where('user_region.userId = :userId', { userId: userId }),
    );
  }

  getProjectRegions(
    queryBuilderFn?: (
      qb: SelectQueryBuilder<Region>,
    ) => SelectQueryBuilder<Region>,
  ): Promise<Region[]> {
    let queryBuilder = this.entityManager.connection
      .createQueryBuilder(Region, 'region')
      .leftJoinAndSelect('region.offices', 'office')
      .leftJoinAndSelect('office.projects', 'project')
      .select(['region.id', 'region.name']);

    if (queryBuilderFn) {
      queryBuilder = queryBuilderFn(queryBuilder);
    }
    return queryBuilder.getMany();
  }
}
