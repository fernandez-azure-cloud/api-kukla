import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from 'src/modules/projects/controllers';
import { GetProjectsQueryDto } from 'src/modules/projects/dtos';
import {
  ProjectAssignmentsRepository,
  ProjectAuthorizationRepository,
  ProjectQuestionsRepository,
  ProjectResponsesRepository,
  ProjectStatusChangeRepository,
  ProjectStatusRepository,
  ProjectsRepository,
} from 'src/modules/projects/repositories';
import {
  ProjectAuthorizationService,
  ProjectValidationService,
  ProjectsService,
} from 'src/modules/projects/services';
import {
  ProjectAction,
  ProjectStatusCode,
  RoleCode,
  SUCCESS_SAVE_MESSAGE,
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

describe('ProjectsController', () => {
  let projectsController: ProjectsController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmTestingModule,
        TypeOrmModule.forFeature([Project, ProjectStatusChange, Response]),
      ],
      controllers: [ProjectsController],
      providers: [
        ProjectsService,
        ProjectsRepository,
        ProjectAuthorizationService,
        ProjectAuthorizationRepository,
        ProjectStatusRepository,
        ProjectStatusChangeRepository,
        ProjectResponsesRepository,
        ProjectQuestionsRepository,
        ProjectAssignmentsRepository,
        ProjectValidationService,
        notificationServiceMockProvider,
      ],
    }).compile();
    projectsController = moduleRef.get<ProjectsController>(ProjectsController);
    const entityManager = await moduleRef.get<EntityManager>(EntityManager);
    await testDataSeed(entityManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('executive', () => {
    let user: User;

    beforeEach(() => {
      user = new User();
      user.id = 1;
      user.userRoles = [new UserRole()];
      user.userRoles[0].role = new Role();
      user.userRoles[0].role.code = RoleCode.Executive;
    });

    it('should list projects', async () => {
      const query = {
        pageIndex: 0,
        pageSize: 10,
        orderColumn: 'project.name',
        orderDirection: 'ASC',
      } as GetProjectsQueryDto;
      const projects = await projectsController.getProjects(user, query);
      expect(projects).not.toBeUndefined();
    });

    it('should return project detail', async () => {
      const user = new User();
      user.id = 1;
      const userRole = new UserRole();
      userRole.role = new Role();
      userRole.role.code = RoleCode.Executive;
      user.userRoles = [userRole];
      const project = await projectsController.getProject(1, user);
      expect(project).not.toBeUndefined();
      expect(project.status.code).toBe(ProjectStatusCode.InProgress);
    });

    it('should save project responses', async () => {
      const result = await projectsController.updateProject(
        1,
        { id: 1, role: { code: RoleCode.Executive } } as User,
        {
          action: ProjectAction.Save,
          responses: [
            { questionId: 1, response: 2 },
            { questionId: 2, response: 1 },
          ],
        },
      );
      expect(result).toBe(SUCCESS_SAVE_MESSAGE);
    });
  });
});
