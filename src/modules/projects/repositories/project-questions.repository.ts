import { Injectable } from '@nestjs/common';
import { Project, Question } from 'src/shared/entities';
import { EntityManager } from 'typeorm';

@Injectable()
export class ProjectQuestionsRepository {
  constructor(private readonly entityManager: EntityManager) {}

  getQuestions(projectId: number): Promise<Question[]> {
    const queryBuilder = this.entityManager.connection
      .createQueryBuilder(Question, 'question')
      .leftJoinAndSelect('question.options', 'question_option')
      .leftJoinAndSelect('question.validations', 'question_validation')
      .leftJoin(Project, 'project', 'project.id = :projectId', { projectId })
      .leftJoin(
        'project.projectAssignments',
        'project_assignment',
        'project_assignment.projectId = project.id and project_assignment.active = true',
      )
      .leftJoin('question_option.speciality', 'speciality')
      .leftJoin('question_option.parent', 'question_option_parent')
      .leftJoinAndSelect(
        'question.responses',
        'response',
        'response.questionId = question.id and response.active = true and response.projectAssignmentId = project_assignment.id',
      )
      .select([
        'question.id',
        'question.text',
        'question.parentId',
        'question.type',
        'question_option.id',
        'question_option.text',
        'question_option.parentId',
        'response.id',
        'response.text',
        'response.questionOptionId',
        'question_validation.id',
        'question_validation.type',
        'question_validation.parameter',
        'question_validation.reference',
        'question_validation.message',
      ])
      .where(
        `(question_option.parentId is null or (question_option_parent.specialityId is null or question_option_parent.specialityId = project.specialityId))
        and (question_option.specialityId is null or question_option.specialityId = project.specialityId)`,
      )
      .orderBy('question.order')
      .addOrderBy('question_option.order');

    return queryBuilder.getMany();
  }

  getQuestion(questionId: number): Promise<Question> {
    const queryBuilder = this.entityManager.connection
      .createQueryBuilder(Question, 'question')
      .select([
        'question.id',
        'question.text',
        'question.parentId',
        'question.type',
      ])
      .where('question.id = :questionId', { questionId });
    return queryBuilder.getOne();
  }
}
