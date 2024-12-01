import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Auditable } from './auditable.entity';
import { QuestionOption } from './question-option.entity';
import { Response } from './response.entity';
import { QuestionValidation } from './question-validation.entity';

@Entity()
export class Question extends Auditable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  type: string;

  @Column()
  order: number;

  @Column({ nullable: true })
  parentId: number;

  @ManyToOne(() => Question)
  parent?: Question;

  @OneToMany(() => QuestionOption, (questionOption) => questionOption.question)
  options?: QuestionOption[];

  @OneToMany(
    () => QuestionValidation,
    (questionValidation) => questionValidation.question,
  )
  validations: QuestionValidation[];

  @OneToMany(() => Response, (response) => response.question)
  responses: Response[];
}
