import * as express from 'express';
import { DataSource, In } from 'typeorm';
import { Account } from '../entity/Account';
import { Transaction } from '../entity/Transaction';
import { TransactionType } from '../entity/TransactionType';

export class TransactionsController {
  constructor(ds: DataSource) {
    this.ds = ds;

    this.router.get(this.path, this.getAll);
    this.router.get(`${this.path}types`, this.getTypes);
    this.router.post(this.path, this.create);
    this.router.delete(this.path, this.delete);
  }

  public router = express.Router();

  private ds: DataSource;

  private path = '/';

  private create = async (request: express.Request, response: express.Response) => {
    console.log('tran create', request.body);

    const tran = this.ds.manager.create(Transaction, {
      ...request.body,
      account: { id: request.body.accountId },
      type: { id: request.body.typeId },
    });

    this.ds.manager
      .save(tran)
      .then((item) => {
        console.log('create - ok: ', item);
        response.send({ tran: item });
      })
      .catch((err) => response.send(err));
  };

  private delete = async (request: express.Request, response: express.Response) => {
    console.log('tran delete', request.body);

    await this.ds
      .createQueryBuilder()
      .delete()
      .from(Transaction)
      .where('id = :id', { id: request.body.id })
      .execute()
      .then((tran) => {
        console.log('delete - ok');
        response.send({ tran: tran });
      })
      .catch((err) => response.send(err));
  };

  private getAll = async (request: express.Request, response: express.Response) => {
    console.log('Loading transactions from the database...');

    const accounts = await this.ds.manager.find(Account, { where: { user: { id: Number(request.headers.userid) } } });
    const accountIds = accounts.map((acc) => acc.id);
    const transactions = await this.ds.manager.find(Transaction, { relations: ['account', 'type'], where: { account: In(accountIds) } });

    /*
    пример поиска юзера со связанными сущностям
    const userRepository = this.ds.getRepository(User);
    const transactions = await userRepository.findOne({
      relations: ['accounts', 'accounts.transactions'],
      where: { id: Number(request.headers.userid) },
    });
*/
    console.log('Loaded transactions: ', transactions);
    response.send(transactions);
  };

  private getTypes = async (request: express.Request, response: express.Response) => {
    console.log('Loading transaction types from the database...');

    const types = await this.ds.manager.find(TransactionType);

    console.log('Loaded types: ', types);
    response.send(types);
  };
}
