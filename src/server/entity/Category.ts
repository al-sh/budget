/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/member-ordering */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Transaction } from './Transaction';
import { TransactionType } from './TransactionType';
import { User } from './User';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name?: string;

  @Column()
  public isActive: boolean = true;

  @ManyToOne(() => TransactionType, (type) => type.categories)
  public type!: TransactionType;

  @OneToMany(() => Category, (category) => category.parentCategory)
  public childrenCategories?: Category[];

  @ManyToOne(() => Category, (category) => category.childrenCategories)
  public parentCategory?: Category;

  @OneToMany(() => Transaction, (tran) => tran.account)
  public transactions?: Transaction;

  @ManyToOne(() => User, (user) => user.accounts)
  public user?: User;
}
