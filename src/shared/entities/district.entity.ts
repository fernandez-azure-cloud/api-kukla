import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Province } from './province.entity';
import { Organization } from './organization.entity';
import { Auditable } from './auditable.entity';
import { Project } from './project.entity';

@Entity()
export class District extends Auditable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  provinceId: number;

  @ManyToOne(() => Province)
  province: Province;

  @OneToMany(() => Organization, (organization) => organization.district)
  organizations: Organization[];

  @OneToMany(() => Project, (project) => project.district)
  projects: Project[];
}
