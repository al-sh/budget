/* eslint-disable @typescript-eslint/member-ordering */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Account } from './Account';
import { Category } from './Category';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public description?: string;

  @Column()
  public amount!: number;

  @Column()
  public dt?: Date;

  @ManyToOne(() => Account, (acc) => acc.transactions)
  public account?: Account;

  @ManyToOne(() => Account, (acc) => acc.incomingTransactions)
  public toAccount?: Account;

  @ManyToOne(() => Category, (cat) => cat.transactions)
  public category?: Category; //в случае переводов между своими счетами поле пустое, но заполнен toAccount
}
