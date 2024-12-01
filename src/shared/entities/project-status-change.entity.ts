import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './project.entity';
import { Auditable } from './auditable.entity';
import { ProjectStatus } from './project-status.entity';

@Entity()
export class ProjectStatusChange extends Auditable {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProjectStatus)
  status: ProjectStatus;

  @ManyToOne(() => Project)
  project: Project;
}
