/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/member-ordering */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Account } from './Account';
import { Transaction } from './Transaction';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public login: string;

  @Column()
  public passwordHash: string;

  @Column()
  public token: string = '';

  @Column()
  public loginAttemts: number = 0;

  @Column()
  public isBlocked: boolean;

  @OneToMany(() => Transaction, (tran) => tran.id)
  public transactions: Transaction;

  @OneToMany(() => Account, (acc) => acc.id)
  public accounts: Account;
}
