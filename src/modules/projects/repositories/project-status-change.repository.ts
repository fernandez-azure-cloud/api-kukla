import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectStatusChange } from 'src/shared/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectStatusChangeRepository {
  constructor(
    @InjectRepository(ProjectStatusChange)
    private readonly statusChangeRepository: Repository<ProjectStatusChange>,
  ) {}

  addProjectStatusChange(
    change: ProjectStatusChange,
  ): Promise<ProjectStatusChange> {
    return this.statusChangeRepository.save(change);
  }
}
