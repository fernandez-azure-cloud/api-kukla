import { Injectable } from '@nestjs/common';
import { ProjectAssignment } from 'src/shared/entities';
import { EntityManager } from 'typeorm';

@Injectable()
export class ProjectAssignmentsRepository {
  constructor(private readonly entityManager: EntityManager) {}

  getActiveAssignment(projectId: number): Promise<ProjectAssignment> {
    return this.entityManager.connection
      .createQueryBuilder(ProjectAssignment, 'project_assignment')
      .select(['project_assignment.id', 'project_assignment.projectId'])
      .where(
        'project_assignment.projectId = :projectId and project_assignment.active = true',
        { projectId },
      )
      .getOne();
  }
}
