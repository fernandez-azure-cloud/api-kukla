import { PaginateDto } from 'src/shared/dtos';
import { Project } from 'src/shared/entities';

export class ProjectListDto extends PaginateDto<Project> {
  showExecutive: boolean;
}
