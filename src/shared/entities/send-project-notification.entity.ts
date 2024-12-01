import { Entity, ManyToOne } from 'typeorm';
import { Project } from './project.entity';
import { Notification } from './notification.entity';

@Entity()
export class SendProjectNotification extends Notification {
  @ManyToOne(() => Project)
  project: Project;
}
