import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Auditable } from './auditable.entity';
import { User } from './user.entity';
import { Organization } from './organization.entity';

@Entity()
export class ExecutiveOrganization extends Auditable {
  @PrimaryColumn()
  executiveId: number;

  @PrimaryColumn()
  organizationId: number;

  @ManyToOne(() => User)
  executive: User;

  @ManyToOne(() => Organization)
  organization: Organization;
}
