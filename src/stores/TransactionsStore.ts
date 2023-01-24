import isBefore from 'date-fns/isBefore';
import parseISO from 'date-fns/parseISO';
import { v4 } from 'uuid';
import { PAGE_SIZE } from '../constants/misc';
import { GetTransactionsQueryParams } from '../hooks/useTransactions';
import { LocalTransaction, LocalTransactionWithNames } from '../server/types/transactions';
import { getLocalDataService } from '../services/LocalDataService';

class TransactionsStore {
  private static instance: TransactionsStore;

  public static getInstance(): TransactionsStore {
    if (!TransactionsStore.instance) {
      TransactionsStore.instance = new TransactionsStore();
    }

    return TransactionsStore.instance;
  }

  private _localDataService = getLocalDataService();

  private addNamesToTran = (tran: LocalTransaction) => {
    const categories = this._localDataService.categories;
    const accounts = this._localDataService.accounts;

    const getAccountName = (tran: LocalTransaction) => {
      let accNameStr = accounts.find((acc) => acc.id === tran.accountId)?.name ?? '';
      if (tran.toAccountId) {
        accNameStr = accNameStr + ' -> ' + accounts.find((acc) => acc.id === tran.toAccountId)?.name;
      }
      return accNameStr;
    };

    return {
      ...tran,
      accountName: getAccountName(tran),
      categoryName: categories.find((cat) => cat.id === tran.categoryId)?.name,
    };
  };

  private compareTransactionsByDates = (a: LocalTransaction, b: LocalTransaction) => {
    if (a.dt === b.dt) return 0;

    return isBefore(parseISO(a.dt), parseISO(b.dt)) ? 1 : -1;
  };

  public create = (formValues: LocalTransaction) => {
    console.log('addTran', formValues);

    return new Promise<void>((resolve) => {
      const transactions = this._localDataService.transactions;
      transactions.push({
        ...formValues,
        id: v4(),
        amount: Math.floor(formValues.amount * 100) ?? 0,
      });
      this._localDataService.transactions = transactions.sort(this.compareTransactionsByDates);
      resolve();
    });
  };

  public delete = (id: string) =>
    new Promise<void>((resolve, reject) => {
      const transactions = this._localDataService.transactions;
      const tranToUpdateIdx = transactions.findIndex((item) => item.id === id);
      if (tranToUpdateIdx == -1) {
        reject('transaction not found id:' + id);
        return;
      }

      transactions.splice(tranToUpdateIdx, 1);
      this._localDataService.transactions = transactions;
      resolve();
    });

  public getList = (params: GetTransactionsQueryParams) => {
    const transactions = this._localDataService.transactions.sort(this.compareTransactionsByDates);

    const result: LocalTransactionWithNames[] = [];
    for (let i = 0; i < transactions.length; i++) {
      const tran = transactions[i];

      if (params.accountId && tran.accountId !== params.accountId && tran.toAccountId !== params.accountId) {
        continue;
      }

      if (params.categoryId && tran.categoryId !== params.categoryId) {
        continue;
      }

      if (params.dateEnd && params.dateEnd.isBefore(tran.dt)) {
        continue;
      }

      if (params.dateFrom && params.dateFrom.isAfter(tran.dt)) {
        continue;
      }

      if (params.typeId && tran.typeId !== params.typeId) {
        continue;
      }

      if (params.pageNum && (i < (params.pageNum - 1) * PAGE_SIZE || i >= params.pageNum * PAGE_SIZE)) {
        continue;
      }

      result.push(this.addNamesToTran(tran));
    }

    return result;
  };

  public getOne: (id: string) => LocalTransactionWithNames | undefined = (id: string) => {
    const tran = this._localDataService.transactions.find((item) => item.id === id);
    if (!tran) {
      return undefined;
    }

    return this.addNamesToTran(tran);
  };

  public update = (id: string, formValues: LocalTransaction) =>
    new Promise<void>((resolve, reject) => {
      const transactions = this._localDataService.transactions;
      const tranToUpdateIdx = transactions.findIndex((item) => item.id === id);
      if (tranToUpdateIdx === -1) {
        console.error('tranToUpdateIdx not found', id, formValues);
        reject();
        return;
      }
      transactions.splice(tranToUpdateIdx, 1);

      transactions.push({
        ...formValues,
        id: v4(),
        amount: Math.round(formValues.amount * 100) ?? 0,
      });
      this._localDataService.transactions = transactions.sort(this.compareTransactionsByDates);
      resolve();
    });
}

export const getTrasactionsStore = () => TransactionsStore.getInstance();
