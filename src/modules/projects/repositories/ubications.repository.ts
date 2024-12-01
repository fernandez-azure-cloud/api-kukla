import { Injectable } from '@nestjs/common';
import { Department, District, Province } from 'src/shared/entities';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class UbicationsRepository {
  constructor(private readonly entityManager: EntityManager) {}

  getAssignedDepartments(userId: number): Promise<Department[]> {
    return this.getDepartments((qb) =>
      qb
        .leftJoinAndSelect('project.projectAssignments', 'project_assignment')
        .where('project_assignment.userId = :userId', { userId: userId })
        .andWhere('project_assignment.active = :active', { active: true }),
    );
  }

  getManagedDepartments(userId: number): Promise<Department[]> {
    return this.getDepartments((qb) =>
      qb
        .leftJoinAndSelect('project.office', 'office')
        .leftJoinAndSelect('office.region', 'region')
        .leftJoinAndSelect('region.userRegions', 'user_region')
        .where('user_region.userId = :userId', { userId: userId }),
    );
  }

  getDepartments(
    queryBuilderFn?: (
      qb: SelectQueryBuilder<Department>,
    ) => SelectQueryBuilder<Department>,
  ): Promise<Department[]> {
    let queryBuilder = this.entityManager.connection
      .createQueryBuilder(Department, 'department')
      .leftJoinAndSelect('department.provinces', 'province')
      .leftJoinAndSelect('province.districts', 'district')
      .leftJoinAndSelect('district.projects', 'project')
      .select(['department.id', 'department.name']);

    if (queryBuilderFn) {
      queryBuilder = queryBuilderFn(queryBuilder);
    }
    return queryBuilder.getMany();
  }

  getAssignedProvinces(userId: number): Promise<Province[]> {
    return this.getProvinces((qb) =>
      qb
        .leftJoinAndSelect('project.projectAssignments', 'project_assignment')
        .where('project_assignment.userId = :userId', { userId: userId })
        .andWhere('project_assignment.active = :active', { active: true }),
    );
  }

  getManagedProvinces(userId: number): Promise<Province[]> {
    return this.getProvinces((qb) =>
      qb
        .leftJoinAndSelect('project.office', 'office')
        .leftJoinAndSelect('office.region', 'region')
        .leftJoinAndSelect('region.userRegions', 'user_region')
        .where('user_region.userId = :userId', { userId: userId }),
    );
  }

  getProvinces(
    queryBuilderFn?: (
      qb: SelectQueryBuilder<Province>,
    ) => SelectQueryBuilder<Province>,
  ): Promise<Province[]> {
    let queryBuilder = this.entityManager.connection
      .createQueryBuilder(Province, 'province')
      .leftJoinAndSelect('province.districts', 'district')
      .leftJoinAndSelect('district.projects', 'project')
      .select(['province.id', 'province.name', 'province.departmentId']);

    if (queryBuilderFn) {
      queryBuilder = queryBuilderFn(queryBuilder);
    }
    return queryBuilder.getMany();
  }

  getAssignedDistricts(userId: number): Promise<District[]> {
    return this.getDistricts((qb) =>
      qb
        .leftJoinAndSelect('project.projectAssignments', 'project_assignment')
        .where('project_assignment.userId = :userId', { userId: userId })
        .andWhere('project_assignment.active = :active', { active: true }),
    );
  }

  getManagedDistricts(userId: number): Promise<District[]> {
    return this.getDistricts((qb) =>
      qb
        .leftJoinAndSelect('project.office', 'office')
        .leftJoinAndSelect('office.region', 'region')
        .leftJoinAndSelect('region.userRegions', 'user_region')
        .where('user_region.userId = :userId', { userId: userId }),
    );
  }

  getDistricts(
    queryBuilderFn?: (
      qb: SelectQueryBuilder<District>,
    ) => SelectQueryBuilder<District>,
  ): Promise<District[]> {
    let queryBuilder = this.entityManager.connection
      .createQueryBuilder(District, 'district')
      .leftJoinAndSelect('district.projects', 'project')
      .select(['district.id', 'district.name', 'district.provinceId']);

    if (queryBuilderFn) {
      queryBuilder = queryBuilderFn(queryBuilder);
    }
    return queryBuilder.getMany();
  }
}
