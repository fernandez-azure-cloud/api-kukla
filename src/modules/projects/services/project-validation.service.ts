import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateProjectDto, UpdateProjectResponseDto } from '../dtos';
import {
  ProjectQuestionsRepository,
  ProjectsRepository,
} from '../repositories';
import { Project, Question, QuestionValidation } from 'src/shared/entities';
import { ProjectAction, QuestionValidationType } from 'src/shared/base';

@Injectable()
export class ProjectValidationService {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly projectQuestionsRepository: ProjectQuestionsRepository,
  ) {}

  async validateUpdateProject(
    updateProject: UpdateProjectDto,
    projectId: number,
  ): Promise<boolean> {
    if (updateProject.action === ProjectAction.Save) {
      const questions =
        await this.projectQuestionsRepository.getQuestions(projectId);
      const project = await this.projectsRepository.getProject(projectId);

      questions.forEach((q) => {
        this.validateResponse(q, updateProject.responses, project);
      });

      return false;
    }

    return false;
  }

  private validateResponse(
    question: Question,
    responses: UpdateProjectResponseDto[],
    project: Project,
  ): boolean {
    const response = responses.find((r) => r.questionId === question.id);
    const validators = question.validations;
    validators.forEach((v) => {
      if (v.reference) {
        v.parameter = project[v.parameter];
      }
      return this.applyValidator(response.response, v);
    });

    return false;
  }

  private applyValidator(
    response: string | number,
    validator: QuestionValidation,
  ): boolean {
    switch (validator.type) {
      case QuestionValidationType.Required:
        if (!response) {
          throw new BadRequestException(validator.message);
        }
        return false;

      case QuestionValidationType.Min:
        if (Number(response) < Number(validator.parameter)) {
          throw new BadRequestException(validator.message);
        }
        return false;

      case QuestionValidationType.Max:
        if (Number(response) > Number(validator.parameter)) {
          throw new BadRequestException(validator.message);
        }
        return false;

      case QuestionValidationType.MinDate:
        if (new Date(response) < new Date(validator.parameter)) {
          throw new BadRequestException(validator.message);
        }
        return false;
    }
  }
}
