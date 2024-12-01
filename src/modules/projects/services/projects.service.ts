import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ProjectAssignmentsRepository,
  ProjectQuestionsRepository,
  ProjectResponsesRepository,
  ProjectStatusChangeRepository,
  ProjectStatusRepository,
  ProjectsRepository,
} from '../repositories';
import {
  Project,
  ProjectStatusChange,
  Response,
  SendProjectNotification,
  User,
} from 'src/shared/entities';
import {
  INVALID_PROJECT_STATUS_FOR_SEND_MESSAGE,
  MISSING_RESPONSES_FOR_SEND_MESSAGE,
  NotificationType,
  ProjectAction,
  ProjectStatusCode,
  RoleCode,
  SUCCESS_SAVE_MESSAGE,
  SUCCESS_SEND_MESSAGE,
} from 'src/shared/base';
import { GetProjectsQueryDto, ProjectListDto, UpdateProjectDto } from '../dtos';
import { NotificationService } from 'src/shared/services';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly projectStatusChangeRepository: ProjectStatusChangeRepository,
    private readonly projectStatusRepository: ProjectStatusRepository,
    private readonly projectQuestionsRepository: ProjectQuestionsRepository,
    private readonly projectResponsesRepository: ProjectResponsesRepository,
    private readonly projectAssignmentsRepository: ProjectAssignmentsRepository,
    private readonly notificationService: NotificationService,
  ) {}

  getProjects(user: User, query: GetProjectsQueryDto): Promise<ProjectListDto> {
    const role = user.role.code;

    switch (role) {
      case RoleCode.Executive:
        return this.projectsRepository.getAssignedProjects(user.id, query);

      case RoleCode.Manager:
        return this.projectsRepository.getManagedProjects(user.id, query);

      case RoleCode.Administrator:
        return this.projectsRepository.getProjects(query);
    }
  }

  async getProject(projectId: number, user: User): Promise<Project> {
    if (user.role.code === RoleCode.Executive) {
      const project = await this.projectsRepository.getProjectStatus(projectId);
      const status = await this.projectStatusRepository.getStatusByCode(
        ProjectStatusCode.InProgress,
      );

      if (project.status.code === ProjectStatusCode.Assigned) {
        const change = new ProjectStatusChange();
        change.project = project;
        change.createdBy = user;
        change.status = status;
        await this.projectStatusChangeRepository.addProjectStatusChange(change);
        project.status = status;
        project.updatedBy = user;
        await this.projectsRepository.updateProject(project);
      }
    }

    return this.projectsRepository.getProject(projectId);
  }

  async updateProject(
    projectId: number,
    payload: UpdateProjectDto,
    user: User,
  ): Promise<string> {
    switch (payload.action) {
      case ProjectAction.Save:
        return this.saveResponses(projectId, payload, user);

      case ProjectAction.Send:
        return this.sendProject(projectId, user);

      default:
        throw new Error('Not implemented');
    }
  }

  async saveResponses(
    projectId: number,
    payload: UpdateProjectDto,
    user: User,
  ): Promise<string> {
    const responses = [];

    for (const r of payload.responses) {
      const response = new Response();
      response.createdBy = user;
      response.question = await this.projectQuestionsRepository.getQuestion(
        r.questionId,
      );
      response.projectAssignment =
        await this.projectAssignmentsRepository.getActiveAssignment(projectId);

      if (response.question.type === 'select') {
        if (r.response) {
          response.questionOptionId = Number(r.response);
        }
      } else {
        response.text = r.response !== null ? String(r.response) : null;
      }

      responses.push(response);
    }

    await this.projectResponsesRepository.inactiveResponses(projectId, user);
    await this.projectResponsesRepository.saveResponses(responses);
    return Promise.resolve(SUCCESS_SAVE_MESSAGE);
  }

  async sendProject(projectId: number, user: User): Promise<string> {
    const project = await this.projectsRepository.getProjectStatus(projectId);
    const status = await this.projectStatusRepository.getStatusByCode(
      ProjectStatusCode.Completed,
    );

    if (
      ![ProjectStatusCode.InProgress, ProjectStatusCode.Observed].includes(
        project.status.code,
      )
    ) {
      throw new BadRequestException(INVALID_PROJECT_STATUS_FOR_SEND_MESSAGE);
    }

    await this.verifyProjectResponses(projectId);

    const change = new ProjectStatusChange();
    change.project = project;
    change.createdBy = user;
    change.status = status;
    await this.projectStatusChangeRepository.addProjectStatusChange(change);
    project.status = status;
    project.updatedBy = user;
    await this.projectsRepository.updateProject(project);
    const extendedProject =
      await this.projectsRepository.getProjectForNotification(projectId);
    const notification = new SendProjectNotification();
    notification.project = extendedProject;
    notification.type = NotificationType.SendProject;
    notification.user = extendedProject.office.region.userRegions[0].user;
    this.notificationService.notify(notification);
    return Promise.resolve(SUCCESS_SEND_MESSAGE);
  }

  async verifyProjectResponses(projectId: number): Promise<boolean> {
    const fields =
      await this.projectQuestionsRepository.getQuestions(projectId);

    fields.forEach((q) => {
      if (!q.responses[0]?.text && !q.responses[0]?.questionOptionId) {
        throw new BadRequestException(MISSING_RESPONSES_FOR_SEND_MESSAGE);
      }
    });

    return true;
  }
}
