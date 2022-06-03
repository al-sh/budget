import * as express from 'express';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { Account } from '../entity/Account';
import { Transaction } from '../entity/Transaction';
import { ETRANSACTION_TYPE } from '../types/transactions';

export class AccountsController {
  constructor(ds: DataSource) {
    this.ds = ds;

    this.router.get(this.path, this.getAll);
    this.router.get(`${this.path}:id`, this.getById);
    this.router.post(this.path, this.create);
    this.router.put(`${this.path}:id`, this.update);
    this.router.delete(`${this.path}:id`, this.delete);
  }

  public router = express.Router();

  private ds: DataSource;

  private path = '/';

  private calculateRest = (transactions: Transaction[], account: Account) => {
    const rest = transactions.reduce((prev, current) => {
      console.log(current);
      if (current.type?.id === ETRANSACTION_TYPE.INCOME || current.type?.id === ETRANSACTION_TYPE.RETURN_EXPENSE) {
        return prev + current.amount;
      }

      if (current.type?.id === ETRANSACTION_TYPE.TRANSFER && current?.toAccount?.id === account.id) {
        return prev + current.amount;
      }

      return prev - current.amount;
    }, account.initialValue);

    console.log('calculateRest', rest, 'trans:', transactions);
    return rest;
  };

  private create = async (request: express.Request, response: express.Response) => {
    console.log('acc create1', request.body);

    const account = this.ds.manager.create(Account, { ...request.body, user: { id: request.headers.userid } });

    this.ds.manager
      .save(account)
      .then((acc) => {
        console.log('create - ok: ', account, acc);
        setTimeout(() => {
          response.send({ account: acc });
        }, 1500); //load emulation
      })
      .catch((err) => response.send(err));
  };

  private delete = async (request: express.Request, response: express.Response) => {
    console.log('acc delete', request.body);
    if (!parseInt(request.params.id)) {
      response.status(500);
      response.send(`acc delete error. request.params.id: ${request.params.id}`);
      return;
    }
    const account = await this.ds.manager.update(Account, parseInt(request.params.id), { isActive: false });
    response.send({ account: account });
  };

  private getAll = async (request: express.Request, response: express.Response) => {
    console.log('Loading accounts from the database...');
    const showHidden = request.query.showHidden === '1';
    console.log(request.query.showHidden, showHidden);

    const whereClause: FindOptionsWhere<Account> = { user: { id: Number(request.headers.userid) } };
    if (!showHidden) {
      whereClause.isActive = true;
    }

    const accounts = await this.ds.manager.find(Account, {
      relations: { incomingTransactions: { toAccount: true, type: true }, transactions: { type: true } },
      where: whereClause,
    });

    console.log('Loaded accounts: ', accounts);

    const accountsWithRest = accounts.map((account) => {
      let transactions: Transaction[] = [];
      if (account.incomingTransactions?.length) {
        transactions = [...transactions, ...account.incomingTransactions];
      }

      if (account.transactions?.length) {
        transactions = [...transactions, ...account.transactions];
      }

      return {
        id: account.id,
        isActive: account.isActive,
        name: account.name,
        rest: this.calculateRest(transactions, account),
      };
    });
    setTimeout(() => {
      response.send(accountsWithRest);
    }, 1500);
  };

  private getById = async (request: express.Request, response: express.Response) => {
    const accId = parseInt(request.params.id);

    const account = await this.ds.manager.findOne(Account, {
      where: { id: accId, user: { id: Number(request.headers.userid) } },
    });

    if (!account) {
      console.error('accounts getById request.params.id', request.params.id, ' - not found');
      response.status(500);
      response.send('account not found');
      return;
    }

    const transactions = await this.ds.manager.find(Transaction, { relations: ['account', 'type'], where: { account: { id: accId } } });
    const incomingTransactions = await this.ds.manager.find(Transaction, {
      relations: ['account', 'type', 'toAccount'],
      where: { toAccount: { id: accId } },
    });
    const rest = this.calculateRest([...transactions, ...incomingTransactions], account);

    console.log('tran cnt:', transactions.length, 'SUM1:', rest);

    setTimeout(() => {
      response.send({ ...account, rest: rest });
    }, 1000);
  };

  private update = async (request: express.Request, response: express.Response) => {
    console.log('acc update', request.body);

    try {
      const account = await this.ds.manager.update(Account, parseInt(request.params.id), request.body);
      response.send({ account: account });
    } catch (err) {
      response.send(err);
    }
  };
}
