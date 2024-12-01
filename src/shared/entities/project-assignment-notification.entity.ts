import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { ProjectAssignment } from './project-assignment.entity';
import { Notification } from './notification.entity';
import { EmailTemplateVersion } from './email_template_version.entity';

@Entity()
export class ProjectAssignmentNotification extends Notification {
  @OneToMany(
    () => ProjectAssignment,
    (projectAssignment) => projectAssignment.notification,
  )
  projectAssignments: ProjectAssignment[];

  @ManyToOne(() => EmailTemplateVersion)
  emailTemplateVersion: EmailTemplateVersion;
}
