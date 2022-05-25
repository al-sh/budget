/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/member-ordering */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Transaction } from './Transaction';
import { User } from './User';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name?: string;

  @Column()
  public isActive: boolean = true;

  @Column()
  public initialValue: number = 0;

  @OneToMany(() => Transaction, (tran) => tran.account)
  public transactions?: Transaction[];

  @ManyToOne(() => User, (user) => user.accounts)
  public user?: User;
}
