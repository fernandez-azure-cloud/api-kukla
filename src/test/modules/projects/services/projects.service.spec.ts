import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetProjectsQueryDto } from 'src/modules/projects/dtos';
import {
  ProjectAssignmentsRepository,
  ProjectQuestionsRepository,
  ProjectResponsesRepository,
  ProjectStatusChangeRepository,
  ProjectStatusRepository,
  ProjectsRepository,
} from 'src/modules/projects/repositories';
import { ProjectsService } from 'src/modules/projects/services';
import {
  INVALID_PROJECT_STATUS_FOR_SEND_MESSAGE,
  MISSING_RESPONSES_FOR_SEND_MESSAGE,
  ProjectAction,
  ProjectStatusCode,
  RoleCode,
  SUCCESS_SAVE_MESSAGE,
  SUCCESS_SEND_MESSAGE,
} from 'src/shared/base';
import {
  Project,
  ProjectStatusChange,
  Response,
  Role,
  User,
  UserRole,
} from 'src/shared/entities';
import { testDataSeed } from 'src/test/data-seed';
import { notificationServiceMockProvider } from 'src/test/mocks';
import { TypeOrmTestingModule } from 'src/test/type-orm-testing.module';
import { EntityManager } from 'typeorm';

describe('ProjectsService', () => {
  let projectsService: ProjectsService;
  let projectsRepository: ProjectsRepository;
  let projectStatusRepository: ProjectStatusRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmTestingModule,
        TypeOrmModule.forFeature([Project, ProjectStatusChange, Response]),
      ],
      providers: [
        ProjectsService,
        ProjectsRepository,
        ProjectStatusRepository,
        ProjectStatusChangeRepository,
        ProjectResponsesRepository,
        ProjectAssignmentsRepository,
        ProjectQuestionsRepository,
        notificationServiceMockProvider,
      ],
    }).compile();
    const entityManager = moduleRef.get<EntityManager>(EntityManager);
    await testDataSeed(entityManager);
    projectsService = moduleRef.get<ProjectsService>(ProjectsService);
    projectsRepository = moduleRef.get<ProjectsRepository>(ProjectsRepository);
    projectStatusRepository = moduleRef.get<ProjectStatusRepository>(
      ProjectStatusRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('List projects', () => {
    it('should return projects list for executive', async () => {
      jest.spyOn(projectsRepository, 'getAssignedProjects');
      const user = new User();
      user.id = 1;
      const userRole = new UserRole();
      userRole.role = new Role();
      userRole.role.code = RoleCode.Executive;
      user.userRoles = [userRole];
      const query = {
        pageIndex: 0,
        pageSize: 10,
        orderColumn: 'project.name',
        orderDirection: 'ASC',
      } as GetProjectsQueryDto;
      await projectsService.getProjects(user, query);
      expect(projectsRepository.getAssignedProjects).toHaveBeenCalled();
    });
  });

  describe('Save project', () => {
    it('should save project responses', async () => {
      const result = await projectsService.updateProject(
        1,
        {
          action: ProjectAction.Save,
          responses: [
            { questionId: 1, response: 2 },
            { questionId: 2, response: 1 },
          ],
        },
        { id: 1, role: { code: RoleCode.Executive } } as User,
      );
      expect(result).toBe(SUCCESS_SAVE_MESSAGE);
    });
  });

  describe('Send project', () => {
    beforeEach(async () => {
      const project = await projectsRepository.getProjectStatus(2);
      const status = await projectStatusRepository.getStatusByCode(
        ProjectStatusCode.InProgress,
      );
      project.status = status;
      await projectsRepository.updateProject(project);
    });

    it('should update project status for send action', async () => {
      await projectsService.updateProject(
        2,
        {
          action: ProjectAction.Save,
          responses: [
            { questionId: 1, response: 2 },
            { questionId: 2, response: 1 },
          ],
        },
        { id: 1, role: { code: RoleCode.Executive } } as User,
      );
      const result = await projectsService.updateProject(
        2,
        {
          action: ProjectAction.Send,
        },
        { id: 1, role: { code: RoleCode.Executive } } as User,
      );
      expect(result).toBe(SUCCESS_SEND_MESSAGE);
    });

    it('should throw error for project whit invalid status for send action', async () => {
      try {
        await projectsService.updateProject(
          1,
          {
            action: ProjectAction.Send,
          },
          { id: 1, role: { code: RoleCode.Executive } } as User,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(INVALID_PROJECT_STATUS_FOR_SEND_MESSAGE);
      }
    });

    it('should throw missing responses for project', async () => {
      try {
        await projectsService.updateProject(
          2,
          {
            action: ProjectAction.Send,
          },
          { id: 1, role: { code: RoleCode.Executive } } as User,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(MISSING_RESPONSES_FOR_SEND_MESSAGE);
      }
    });
  });
});
