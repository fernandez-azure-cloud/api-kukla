import {
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export abstract class Auditable {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User)
  createdBy: User;

  @ManyToOne(() => User)
  updatedBy: User;

  @ManyToOne(() => User)
  deletedBy: User;
}
