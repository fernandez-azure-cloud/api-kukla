import { Injectable } from '@nestjs/common';
import { RoleCode } from 'src/shared/base';
import { Project, ProjectAssignment, User } from 'src/shared/entities';
import { EntityManager } from 'typeorm';

@Injectable()
export class ProjectAuthorizationRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async canShowProject(projectId: number, user: User): Promise<boolean> {
    if (user.role.code === RoleCode.Administrator) {
      return true;
    }

    if (user.role.code === RoleCode.Executive) {
      const authQueryBuilder = this.entityManager.connection
        .createQueryBuilder(ProjectAssignment, 'project_assignment')
        .select([])
        .where(
          'project_assignment.userId = :userId and project_assignment.projectId = :projectId and project_assignment.active = :active',
          { projectId, userId: user.id, active: true },
        );

      const projectAssignment = await authQueryBuilder.getCount();
      return projectAssignment > 0;
    }

    if (user.role.code === RoleCode.Manager) {
      const authQueryBuilder = this.entityManager.connection
        .createQueryBuilder(Project, 'project')
        .leftJoin('project.office', 'office')
        .leftJoin('office.region', 'region')
        .leftJoin('region.userRegions', 'user_region')
        .select([])
        .where('user_region.userId = :userId and project.id = :projectId', {
          projectId,
          userId: user.id,
        });

      const projects = await authQueryBuilder.getCount();
      return projects > 0;
    }

    return false;
  }
}
