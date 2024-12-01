import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Auditable } from './auditable.entity';

@Entity()
export class Token extends Auditable {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  accessToken: string;

  @Index()
  @Column()
  refreshToken: string;

  @ManyToOne(() => User)
  user: User;
}
