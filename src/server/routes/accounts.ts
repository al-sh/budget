import * as express from 'express';
import { DataSource } from 'typeorm';
import { Account } from '../entity/Account';
import { Transaction } from '../entity/Transaction';
import { ETRANSACTION_TYPE } from '../types/transactions';

export class AccountsController {
  constructor(ds: DataSource) {
    this.ds = ds;

    // this.intializeAccounts();

    this.router.get(this.path, this.getAll);
    this.router.get(`${this.path}:id`, this.getById);
    this.router.post(this.path, this.create);
    this.router.put(`${this.path}:id`, this.update);
    this.router.delete(this.path, this.delete);
  }

  public router = express.Router();

  private ds: DataSource;

  private path = '/';

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

    await this.ds
      .createQueryBuilder()
      .delete()
      .from(Account)
      .where('id = :id', { id: request.body.id })
      .execute()
      .then((acc) => {
        console.log('delete - ok');
        response.send({ account: acc });
      })
      .catch((err) => response.send(err));
  };

  private getAll = async (request: express.Request, response: express.Response) => {
    console.log('Loading accounts from the database...');

    const accounts = await this.ds.manager.find(Account, { where: { user: { id: Number(request.headers.userid) } } });

    console.log('Loaded accounts: ', accounts);
    setTimeout(() => {
      response.send(accounts);
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
    const rest = transactions.reduce((prev, current) => {
      console.log(current);
      if (current.type?.id === ETRANSACTION_TYPE.INCOME || current.type?.id === ETRANSACTION_TYPE.RETURN_EXPENSE) {
        return prev + current.amount;
      }

      return prev - current.amount;
    }, account.initialValue);

    console.log('tran cnt:', transactions.length, 'SUM1:', rest);

    setTimeout(() => {
      response.send({ ...account, rest: rest });
    }, 1000);
  };

  private async intializeAccounts() {
    await this.ds.createQueryBuilder().delete().from(Account).execute();

    const account = new Account();
    account.name = 'Tinkoff';
    account.isActive = true;

    const account2 = new Account();
    account2.name = 'Test';
    account2.isActive = false;

    await this.ds.manager.save([account, account2]);
    console.log('Saved a new user with id: ' + account.id);
  }

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
