/* eslint-disable @typescript-eslint/member-ordering */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Transaction } from './Transaction';
import { User } from './User';

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

  @ManyToOne(() => User, (user) => user.id)
  public user: User;
}
