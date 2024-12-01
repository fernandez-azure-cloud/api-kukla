import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Auditable } from './auditable.entity';
import { Office } from './office.entity';
import { UserRegion } from './user-region.entity';

@Entity()
export class Region extends Auditable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Office, (office) => office.region)
  offices: Office[];

  @OneToMany(() => UserRegion, (userRegion) => userRegion.region)
  userRegions: UserRegion[];
}
