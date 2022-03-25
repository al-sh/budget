/* eslint-disable @typescript-eslint/member-ordering */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Account } from './Account';
import { TransactionType } from './TransactionType';
import { User } from './User';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public description: string;

  @Column()
  public accountId: string;

  @ManyToOne(() => TransactionType, (type) => type.id)
  public type: TransactionType;

  @ManyToOne(() => Account, (acc) => acc.id)
  public account: Account;

  @ManyToOne(() => User, (user) => user.transactions)
  public user: User;
}
