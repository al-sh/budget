import { v4 } from 'uuid';
import { Account } from '../server/entity/Account';
import { LocalAccount, LocalAccountWithRest } from '../server/types/accounts';
import { ETRANSACTION_TYPE } from '../server/types/transactions';
import { getLocalDataService } from '../services/LocalDataService';
import { formatDateISOstr } from '../utils/format';

class AccountsStore {
  private static instance: AccountsStore;

  public static getInstance(): AccountsStore {
    if (!AccountsStore.instance) {
      AccountsStore.instance = new AccountsStore();
    }

    return AccountsStore.instance;
  }

  private _localDataService = getLocalDataService();

  private calculateRest = (account: LocalAccount) => {
    const transactions = this._localDataService.transactions;

    const rest = transactions.reduce((prev, current) => {
      if (
        current.accountId === account.id &&
        (current.typeId === ETRANSACTION_TYPE.EXPENSE ||
          current.typeId === ETRANSACTION_TYPE.RETURN_INCOME ||
          current.typeId === ETRANSACTION_TYPE.TRANSFER)
      ) {
        return prev - current.amount;
      }
      if (
        current.accountId === account.id &&
        (current.typeId === ETRANSACTION_TYPE.INCOME || current.typeId === ETRANSACTION_TYPE.RETURN_EXPENSE)
      ) {
        return prev + current.amount;
      }

      if (current.toAccountId && current?.toAccountId === account.id) {
        return prev + current.amount;
      }

      return prev;
    }, account.initialValue);

    return rest;
  };

  private compareAccounts = (a: LocalAccount, b: LocalAccount) => {
    if (a.name === b.name) return 0;
    return a.name > b.name ? -1 : 1;
  };

  public create = (formValues: Account) => {
    console.log('addAccount', formValues);

    return new Promise<void>((resolve) => {
      const accounts = this._localDataService.accounts;
      accounts.push({
        id: v4(),
        isActive: formValues.isActive ?? true,
        name: formValues.name ?? '',
        icon: formValues.icon ?? '',
        initialValue: Math.floor(parseFloat(formValues.initialValue as unknown as string) * 100) ?? 0,
      });
      this._localDataService.accounts = accounts.sort(this.compareAccounts);
      resolve();
    });
  };

  public delete = (id: string) =>
    new Promise<void>((resolve, reject) => {
      const accounts = this._localDataService.accounts;
      const accToUpdateIdx = accounts.findIndex((item) => item.id === id);

      if (accToUpdateIdx === -1) {
        reject('acc delete, id not found:' + id);
        return;
      }

      const transactions = this._localDataService.transactions;
      const accTransactions = transactions.filter((tran) => tran.accountId === id || tran.toAccountId === id);

      if (accTransactions.length) {
        alert(
          'Счет сделан неактивным, а не удалён, т.к. по счету были найдены транзакции. \nДаты:\n' +
            accTransactions.map((tran) => formatDateISOstr(tran.dt)).join('\n')
        );
        accounts[accToUpdateIdx].isActive = false;
      } else {
        console.log('acc delete', accToUpdateIdx);
        accounts.splice(accToUpdateIdx, 1);
      }

      this._localDataService.accounts = accounts;

      resolve();
    });

  public getList: (showHidden?: boolean) => LocalAccountWithRest[] = (showHidden?: boolean) => {
    const accounts = showHidden ? this._localDataService.accounts : this._localDataService.accounts.filter((acc) => acc.isActive);

    const accountsWithRest = accounts.map((item) => {
      return {
        id: item.id,
        icon: item.icon,
        initialValue: item.initialValue,
        isActive: item.isActive,
        name: item.name,
        rest: this.calculateRest(item),
      };
    });

    return accountsWithRest;
  };

  public getOne: (id: string) => LocalAccountWithRest | undefined = (id: string) => {
    const account = this._localDataService.accounts.find((item) => item.id === id);
    if (!account) {
      return undefined;
    }

    return { ...account, rest: this.calculateRest(account) };
  };

  public update = (id: string, formValues: LocalAccount) =>
    new Promise<void>((resolve, reject) => {
      const accounts = this._localDataService.accounts;
      const accToUpdateIdx = accounts.findIndex((item) => item.id === id);
      if (accToUpdateIdx === -1) {
        console.error('accToUpdateIdx not found', id, formValues);
        reject();
        return;
      }
      accounts.splice(accToUpdateIdx, 1);
      accounts.push({
        ...formValues,
        initialValue: Math.floor(parseFloat(formValues.initialValue as unknown as string) * 100) ?? 0,
        id: id,
      });
      this._localDataService.accounts = accounts.sort(this.compareAccounts);
      resolve();
    });
}

export const getAccountsStore = () => AccountsStore.getInstance();
