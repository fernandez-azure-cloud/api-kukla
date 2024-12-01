import { Injectable } from '@nestjs/common';
import { User } from 'src/shared/entities';
import { EntityManager } from 'typeorm';

@Injectable()
export class ManagedUsersRepository {
  constructor(private readonly entityManager: EntityManager) {}

  getManagedUsers(userId: number): Promise<User[]> {
    const qb = this.entityManager.connection
      .createQueryBuilder(User, 'executive')
      .leftJoin('executive.projectAssignments', 'project_assignment')
      .leftJoin('project_assignment.project', 'project')
      .leftJoin('project.office', 'office')
      .leftJoin('office.region', 'region')
      .leftJoin('region.userRegions', 'user_region')
      .select(['executive.id', 'executive.name', 'executive.firstSurname'])
      .where('user_region.userId = :userId', { userId });

    return qb.getMany();
  }
}
