import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Auditable } from './auditable.entity';
import { Organization } from './organization.entity';
import { Project } from './project.entity';

@Entity()
export class FinancialUnit extends Auditable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Organization)
  organization: Organization;

  @OneToMany(() => Project, (project) => project.financialUnit)
  projects: Project[];
}
