import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { EmailTemplate } from './email_template.entity';
import { Auditable } from './auditable.entity';

@Entity()
export class EmailTemplateVersion extends Auditable {
  @PrimaryColumn()
  emailTemplateId: number;

  @PrimaryColumn()
  version: number;

  @Column()
  subject: string;

  @Column()
  text: string;

  @Column()
  html: string;

  @ManyToOne(() => EmailTemplate)
  emailTemplate: EmailTemplate;
}
