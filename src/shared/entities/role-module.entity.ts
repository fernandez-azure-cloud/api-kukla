import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Role } from './role.entity';
import { Module } from './module.entity';
import { Auditable } from './auditable.entity';

@Entity()
export class RoleModule extends Auditable {
  @PrimaryColumn()
  roleId: number;

  @PrimaryColumn()
  moduleId: number;

  @ManyToOne(() => Role, (role) => role.roleModules)
  role: Role;

  @ManyToOne(() => Module, (module) => module.roleModules)
  module: Module;
}