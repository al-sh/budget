import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Transaction } from "./Transaction";

@Entity()
export class TransactionType {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  imageUrl: string;

  @OneToMany(() => Transaction, (tran) => tran.type)
  transactions: Transaction[];
}
