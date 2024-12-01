import { Injectable } from '@nestjs/common';
import { ProjectAuthorizationRepository } from '../repositories';
import { User } from 'src/shared/entities';

@Injectable()
export class ProjectAuthorizationService {
  constructor(
    private readonly projectAuthorizationRepository: ProjectAuthorizationRepository,
  ) {}

  getAuthorization(projectId: number, user: User): Promise<boolean> {
    return this.projectAuthorizationRepository.canShowProject(projectId, user);
  }
}
