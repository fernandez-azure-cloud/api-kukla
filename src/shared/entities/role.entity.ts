import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RecordState, RoleCode } from '../base';
import { Auditable } from './auditable.entity';
import { RoleModule } from './role-module.entity';
import { RolePermission } from './role-permission.entity';
import { UserRole } from './user-role.entity';

@Entity()
@Unique(['code'])
export class Role extends Auditable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: RoleCode;

  @Column()
  description: string;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];

  @OneToMany(() => RoleModule, (roleModule) => roleModule.role)
  roleModules: RoleModule[];

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions: RolePermission[];

  @Column({ default: RecordState.Active })
  status: string;
}
