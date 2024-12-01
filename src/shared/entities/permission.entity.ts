import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Module } from './module.entity';
import { Auditable } from './auditable.entity';
import { RolePermission } from './role-permission.entity';

@Entity()
export class Permission extends Auditable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column()
  resource: string;

  @Column()
  method: string;

  @ManyToOne(() => Module)
  module: Module;

  @OneToMany(
    () => RolePermission,
    (rolePermission) => rolePermission.permission,
  )
  rolePermissions: RolePermission[];
}
