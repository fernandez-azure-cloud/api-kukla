import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Project, User } from 'src/shared/entities';
import { ProjectValidationService, ProjectsService } from '../services';
import { RequestUser } from 'src/shared/decorators';
import { GetProjectsQueryDto, ProjectListDto, UpdateProjectDto } from '../dtos';
import { ValidationPipe } from 'src/pipes';
import { GetProjectsQuerySchema, UpdateProjectSchema } from '../validations';
import { ProjectGuard } from '../guards';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly projectValidationService: ProjectValidationService,
  ) {}

  @Get()
  getProjects(
    @RequestUser() user: User,
    @Query(new ValidationPipe(GetProjectsQuerySchema))
    query: GetProjectsQueryDto,
  ): Promise<ProjectListDto> {
    return this.projectsService.getProjects(user, query);
  }

  @Get(':id')
  @UseGuards(ProjectGuard)
  getProject(
    @Param('id') projectId: number,
    @RequestUser() user: User,
  ): Promise<Project> {
    return this.projectsService.getProject(projectId, user);
  }

  @Put(':id')
  @UseGuards(ProjectGuard)
  async updateProject(
    @Param('id') projectId: number,
    @RequestUser() user: User,
    @Body(new ValidationPipe(UpdateProjectSchema)) payload: UpdateProjectDto,
  ): Promise<string> {
    await this.projectValidationService.validateUpdateProject(
      payload,
      projectId,
    );
    return this.projectsService.updateProject(projectId, payload, user);
  }
}
