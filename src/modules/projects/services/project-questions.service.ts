import { Injectable } from '@nestjs/common';
import { Question } from 'src/shared/entities';
import { ProjectQuestionsRepository } from '../repositories';

@Injectable()
export class ProjectQuestionsService {
  constructor(
    private readonly projectQuestionsRepository: ProjectQuestionsRepository,
  ) {}

  getQuestions(projectId: number): Promise<Question[]> {
    return this.projectQuestionsRepository.getQuestions(projectId);
  }
}
