import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Currency } from './currency.entity';
import { ColumnDecimalTransformer } from 'src/utils';
import { Auditable } from './auditable.entity';

@Entity()
export class AmountRange extends Auditable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'decimal',
    nullable: true,
    transformer: new ColumnDecimalTransformer(),
  })
  minAmount: number;

  @Column({
    type: 'decimal',
    nullable: true,
    transformer: new ColumnDecimalTransformer(),
  })
  maxAmount: number;

  @ManyToOne(() => Currency)
  currency: Currency;
}
