import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Auditable } from './auditable.entity';
import { Role } from './role.entity';
import { Permission } from './permission.entity';

@Entity()
export class RolePermission extends Auditable {
  @PrimaryColumn()
  roleId: number;

  @PrimaryColumn()
  permissionId: number;

  @ManyToOne(() => Role)
  role: Role;

  @ManyToOne(() => Permission)
  permission: Permission;
}
