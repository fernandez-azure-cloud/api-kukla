import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Province } from './province.entity';
import { Auditable } from './auditable.entity';

@Entity()
export class Department extends Auditable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Province, (province) => province.department)
  provinces: Province[];
}
