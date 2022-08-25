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

  @OneToMany(() => Transaction, (tran) => tran.category)
  public transactions?: Transaction[];

  @ManyToOne(() => User, (user) => user.accounts)
  public user?: User;
}

export interface CategoryWithAmount extends Category {
  amount: number;
}

export interface CategoryWithAmountAndShare extends CategoryWithAmount {
  share: number;
}

export interface ICategoryTreeItem {
  title?: string;
  id: number;
  key: string | number; //key и value - для Tree в antd
  value: number;
  isActive?: boolean;
  children?: ICategoryTreeItem[];
  transactions?: Transaction[];
}

// eslint-disable-next-line sort-exports/sort-exports
export interface ICategoryStatItem extends ICategoryTreeItem {
  amount: number;
  share: number;
}
