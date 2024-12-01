import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EmailTemplateVersion } from './email_template_version.entity';
import { Auditable } from './auditable.entity';

@Entity()
export class EmailTemplate extends Auditable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @OneToMany(
    () => EmailTemplateVersion,
    (emailTemplateVersion) => emailTemplateVersion.emailTemplate,
  )
  versions: EmailTemplateVersion[];
}
