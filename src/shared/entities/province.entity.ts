import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Department } from './department.entity';
import { Auditable } from './auditable.entity';
import { District } from './district.entity';

@Entity()
export class Province extends Auditable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  departmentId: number;

  @ManyToOne(() => Department)
  department: Department;

  @OneToMany(() => District, (district) => district.province)
  districts: District[];
}
