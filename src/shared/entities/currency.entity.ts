import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Auditable } from './auditable.entity';

@Entity()
export class Currency extends Auditable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isoCode: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  symbol: string;
}
