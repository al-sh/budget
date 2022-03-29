/* eslint-disable @typescript-eslint/member-ordering */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Account } from './Account';
import { TransactionType } from './TransactionType';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public description: string;

  @Column()
  public amount: number;

  @ManyToOne(() => TransactionType, (type) => type.transactions)
  public type: TransactionType;

  @ManyToOne(() => Account, (acc) => acc.transactions)
  public account: Account;
}
