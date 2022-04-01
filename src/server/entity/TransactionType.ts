/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { ETRANSACTION_TYPE } from '../types/transactions';
import { Category } from './Category';
import { Transaction } from './Transaction';

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
