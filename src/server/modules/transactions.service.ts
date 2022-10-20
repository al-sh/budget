import { Transaction } from '../entity/Transaction';

type TransactionToInsert = Optional<Transaction, 'toAccount' | 'category' | 'description'>;

export class TransactionsService {
  public create(item: TransactionToInsert) {
    console.log('todo', item);
  }
}
