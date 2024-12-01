import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Auditable } from './auditable.entity';
import { ExecutiveOrganization } from './executive-organization.entity';
import { District } from './district.entity';
import { FinancialUnit } from './financial-unit.entity';

@Entity()
export class Organization extends Auditable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  taxIdentificationNumber: string;

  @Column()
  isicomCode: string;

  @ManyToOne(() => District)
  district: District;

  @OneToMany(() => FinancialUnit, (financialUnit) => financialUnit.organization)
  financialUnits: FinancialUnit[];

  @OneToMany(
    () => ExecutiveOrganization,
    (executiveOrganization) => executiveOrganization.organization,
  )
  executiveOrganizations: ExecutiveOrganization[];
}
