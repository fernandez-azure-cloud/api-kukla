import { Column, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Auditable } from './auditable.entity';
import { NotificationType } from '../base';
import { User } from './user.entity';
import { EmailTemplateVersion } from './email_template_version.entity';

export abstract class Notification extends Auditable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @OneToOne(() => User)
  user: User;

  type: NotificationType;
  html: string;
  text: string;
  subject: string;

  @ManyToOne(() => EmailTemplateVersion)
  emailTemplateVersion: EmailTemplateVersion;
}
