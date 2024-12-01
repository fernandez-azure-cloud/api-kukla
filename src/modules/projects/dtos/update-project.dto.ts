import { ProjectAction } from 'src/shared/base';

export class UpdateProjectResponseDto {
  questionId: number;
  response: string | number;
}

export class UpdateProjectDto {
  action: ProjectAction;
  responses?: UpdateProjectResponseDto[];
}
