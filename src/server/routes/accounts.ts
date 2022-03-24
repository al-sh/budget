import * as express from 'express';
import { DataSource } from 'typeorm';
import { Account } from '../entity/Account';

export class AccountsController {
  constructor(ds: DataSource) {
    this.ds = ds;

    // this.intializeAccounts();

    this.router.get(this.path, this.getAll);
    this.router.post(this.path, this.create);
    this.router.delete(this.path, this.delete);
  }

  public router = express.Router();

  private ds: DataSource;

  private path = '/';

  private create = async (request: express.Request, response: express.Response) => {
    console.log('acc create1', request.body);

    const account = this.ds.manager.create(Account, request.body);

    this.ds.manager
      .save(account)
      .then((acc) => {
        console.log('create - ok: ', account, acc);
        response.send({ account: acc });
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
    const accounts = await this.ds.manager.find(Account);
    console.log('Loaded accounts: ', accounts);
    response.send(accounts);
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
}
