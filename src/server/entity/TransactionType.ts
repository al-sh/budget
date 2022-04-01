/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Category } from './Category';
import { Transaction } from './Transaction';

export enum ETRANSACTION_TYPE {
  EXPENSE = 1,
  INCOME = 2,
  RETURN_EXPENSE = 3,
  RETURN_INCOME = 4,
  TRANSFER = 5,
}

@Entity()
export class TransactionType {
  @PrimaryColumn()
  id: ETRANSACTION_TYPE;

  @Column()
  name: string;

  @Column()
  imageUrl: string;

  @OneToMany(() => Transaction, (tran) => tran.type)
  transactions: Transaction[];

  @OneToMany(() => Category, (cat) => cat.type)
  categories: Category[];
}
