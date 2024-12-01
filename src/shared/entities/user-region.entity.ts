import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { Region } from './region.entity';
import { Auditable } from './auditable.entity';

@Entity()
export class UserRegion extends Auditable {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  regionId: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Region)
  region: Region;
}
