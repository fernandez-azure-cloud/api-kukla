import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';
import { Auditable } from './auditable.entity';

@Entity()
export class QuestionValidation extends Auditable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  parameter: string;

  @Column()
  reference: boolean;

  @Column({ nullable: true })
  message: string;

  @ManyToOne(() => Question)
  question: Question;
}
