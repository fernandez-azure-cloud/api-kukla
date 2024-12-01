import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AssignmentType } from '../base';
import { Project } from './project.entity';
import { User } from './user.entity';
import { Auditable } from './auditable.entity';
import { ProjectAssignmentNotification } from './project-assignment-notification.entity';
import { Response } from './response.entity';

@Entity()
export class ProjectAssignment extends Auditable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  projectId: number;

  @Column()
  userId: number;

  @Column()
  assignmentType: AssignmentType;

  @Column()
  active: boolean;

  @ManyToOne(() => Project, (project) => project.projectAssignments)
  project: Project;

  @ManyToOne(() => User, (user) => user.projectAssignments)
  user: User;

  @ManyToOne(() => ProjectAssignmentNotification)
  notification: ProjectAssignmentNotification;

  @OneToMany(() => Response, (response) => response.projectAssignment)
  responses: Response[];
}
