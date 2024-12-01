import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
  AfterLoad,
} from 'typeorm';
import { ProjectAssignment } from './project-assignment.entity';
import { Auditable } from './auditable.entity';
import { UserRole } from './user-role.entity';
import { RecordState } from '../base';
import { ExecutiveOrganization } from './executive-organization.entity';
import { ExecutiveOrganizationSpeciality } from './executive-organization-speciality.entity';
import { Role } from './role.entity';
import { UserRegion } from './user-region.entity';

@Entity()
@Unique(['email'])
export class User extends Auditable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  firstSurname: string;

  @Column()
  lastSurname: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  isicomCode: string;

  @Column()
  password: string;

  @Column({ default: RecordState.Active })
  status: string;

  @OneToMany(() => UserRole, (userRole) => userRole.user, { cascade: true })
  userRoles: UserRole[];

  @OneToMany(
    () => ProjectAssignment,
    (projectAssignment) => projectAssignment.user,
  )
  projectAssignments: ProjectAssignment[];

  @OneToMany(
    () => ExecutiveOrganization,
    (executiveOrganization) => executiveOrganization.executive,
  )
  executiveOrganizations: ExecutiveOrganization[];

  @OneToMany(
    () => ExecutiveOrganizationSpeciality,
    (executiveOrganizationSpeciality) =>
      executiveOrganizationSpeciality.executive,
  )
  executiveOrganizationSpecialities: ExecutiveOrganizationSpeciality[];

  @OneToMany(() => UserRegion, (userRegion) => userRegion.user)
  userRegions: UserRegion[];

  get role(): Role {
    return this.userRoles[0]?.role;
  }

  get fullname(): string {
    return `${this.name} ${this.firstSurname} ${this.lastSurname}`;
  }

  shortname: string;

  @AfterLoad()
  getFullname(): void {
    this.shortname = `${this.name} ${this.firstSurname}`;
  }
}
