import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectStatusCode } from '../base';
import { Project } from './project.entity';

@Entity()
export class ProjectStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  code: ProjectStatusCode;

  @OneToMany(() => Project, (project) => project.status)
  projects: Project[];
}
