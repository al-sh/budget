/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/member-ordering */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, Tree, TreeChildren, TreeParent } from 'typeorm';
import { Transaction } from './Transaction';
import { TransactionType } from './TransactionType';
import { User } from './User';

@Entity()
@Tree('materialized-path')
export class Category {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name?: string;

  @Column()
  public isActive?: boolean = true;

  @ManyToOne(() => TransactionType, (type) => type.categories)
  public type!: TransactionType;

  @TreeChildren({ cascade: true })
  public childrenCategories?: Category[];

  @TreeParent()
  public parentCategory?: Category;

  @OneToMany(() => Transaction, (tran) => tran.account)
  public transactions?: Transaction;

  @ManyToOne(() => User, (user) => user.accounts)
  public user?: User;
}

export interface ICategoryTreeItem {
  title?: string;
  key: string | number;
  value: number;
  isActive?: boolean;
  children?: ICategoryTreeItem[];
}
