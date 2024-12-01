import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Auditable } from './auditable.entity';

@Entity()
export class StudyStage extends Auditable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
