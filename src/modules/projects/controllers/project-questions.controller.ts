import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Question } from 'src/shared/entities';
import { ProjectQuestionsService } from '../services';
import { GetProjectQuestions } from '../dtos';
import { GetProjectQuestionsSchema } from '../validations';
import { ValidationPipe } from 'src/pipes';
import { ProjectGuard } from '../guards';

@Controller('project-questions')
export class ProjectQuestionsController {
  constructor(
    private readonly projectQuestionsService: ProjectQuestionsService,
  ) {}

  @Get()
  @UseGuards(ProjectGuard)
  getQuestions(
    @Query(new ValidationPipe(GetProjectQuestionsSchema))
    query: GetProjectQuestions,
  ): Promise<Question[]> {
    return this.projectQuestionsService.getQuestions(query.projectId);
  }
}
