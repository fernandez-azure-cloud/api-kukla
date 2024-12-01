import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';
import { Auditable } from './auditable.entity';
import { Speciality } from './speciality.entity';

@Entity()
export class QuestionOption extends Auditable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  order: number;

  @Column({ nullable: true })
  specialityId: number;

  @Column({ nullable: true })
  parentId: number;

  @Column()
  questionId: number;

  @ManyToOne(() => Question)
  question: Question;

  @ManyToOne(() => Speciality)
  speciality?: Speciality;

  @ManyToOne(() => QuestionOption)
  parent?: QuestionOption;
}
