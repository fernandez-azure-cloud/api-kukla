import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Auditable } from './auditable.entity';
import { Region } from './region.entity';
import { Project } from './project.entity';

@Entity()
export class Office extends Auditable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Region)
  region: Region;

  @OneToMany(() => Project, (project) => project.office)
  projects: Project[];
}
