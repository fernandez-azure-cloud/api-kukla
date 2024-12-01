import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';
import { Auditable } from './auditable.entity';
import { ProjectAssignment } from './project-assignment.entity';
import { QuestionOption } from './question-option.entity';

@Entity()
export class Response extends Auditable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  text?: string;

  @Column({ nullable: true })
  questionOptionId?: number;

  @Column({ default: true })
  active: boolean;

  @Column()
  projectAssignmentId: number;

  @Column()
  questionId: number;

  @ManyToOne(() => Question)
  question: Question;

  @ManyToOne(() => QuestionOption)
  questionOption?: QuestionOption;

  @ManyToOne(() => ProjectAssignment)
  projectAssignment: ProjectAssignment;
}
