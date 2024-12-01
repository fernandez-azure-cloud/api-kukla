import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Auditable } from './auditable.entity';
import { User } from './user.entity';
import { Organization } from './organization.entity';
import { Speciality } from './speciality.entity';

@Entity()
export class ExecutiveOrganizationSpeciality extends Auditable {
  @PrimaryColumn()
  executiveId: number;

  @PrimaryColumn()
  organizationId: number;

  @PrimaryColumn()
  specialityId: number;

  @ManyToOne(() => User)
  executive: User;

  @ManyToOne(() => Organization)
  organization: Organization;

  @ManyToOne(() => Speciality)
  speciality: Speciality;
}
