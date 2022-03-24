/* eslint-disable @typescript-eslint/member-ordering */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from './Transaction';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public isActive: boolean;

  @OneToMany(() => Transaction, (tran) => tran.id)
  public transactions: Transaction;
}
