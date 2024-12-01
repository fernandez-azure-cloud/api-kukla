import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Auditable } from './auditable.entity';
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity()
export class UserRole extends Auditable {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  roleId: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Role)
  role: Role;
}
