import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Auditable } from './auditable.entity';
import { Permission } from './permission.entity';
import { RoleModule } from './role-module.entity';

@Entity()
export class Module extends Auditable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  route: string;

  @OneToMany(() => Permission, (permission) => permission.module)
  permissions: Permission[];

  @OneToMany(() => RoleModule, (roleModule) => roleModule.module)
  roleModules: RoleModule[];
}
