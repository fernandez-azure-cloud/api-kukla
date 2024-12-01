import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectAssignment } from './project-assignment.entity';
import { Auditable } from './auditable.entity';
import { District } from './district.entity';
import { Office } from './office.entity';
import { StudyStage } from './study-stage.entity';
import { FinancialUnit } from './financial-unit.entity';
import { Speciality } from './speciality.entity';
import { ProjectStatus } from './project-status.entity';
import { ColumnDecimalTransformer } from 'src/utils';
import { Currency } from './currency.entity';

@Entity()
export class Project extends Auditable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uniqueInvestmentCode: string;

  @Column()
  name: string;

  @Column()
  priority: string;

  @ManyToOne(() => ProjectStatus)
  status: ProjectStatus;

  @Column({
    type: 'decimal',
    transformer: new ColumnDecimalTransformer(),
  })
  viableAmount: number;

  @Column({ nullable: true })
  feasibilityDate: Date;

  @Column({
    type: 'decimal',
    transformer: new ColumnDecimalTransformer(),
  })
  updatedAmount: number;

  @Column()
  description: string;

  @Column({ default: 1 })
  currencyId: number;

  @ManyToOne(() => District)
  district: District;

  @ManyToOne(() => Office)
  office: Office;

  @ManyToOne(() => StudyStage)
  lastStudy: StudyStage;

  @ManyToOne(() => StudyStage)
  feasibilityLevel: StudyStage;

  @ManyToOne(() => FinancialUnit)
  financialUnit: FinancialUnit;

  @ManyToOne(() => Speciality)
  speciality: Speciality;

  @ManyToOne(() => Currency)
  currency: Currency;

  @OneToMany(
    () => ProjectAssignment,
    (projectAssignment) => projectAssignment.project,
  )
  projectAssignments: ProjectAssignment[];
}
