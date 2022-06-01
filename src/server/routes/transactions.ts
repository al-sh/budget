import * as express from 'express';
import { DataSource, In } from 'typeorm';
import { Account } from '../entity/Account';
import { Category } from '../entity/Category';
import { Transaction } from '../entity/Transaction';
import { TransactionType } from '../entity/TransactionType';
import { ETRANSACTION_TYPE } from '../types/transactions';
import { PAGE_SIZE } from '../../constants/misc';

export class TransactionsController {
  constructor(ds: DataSource) {
    this.ds = ds;

    if (process.env.DB_NEED_REINIT) {
      this.intialize();
    }

    this.router.get(this.path, this.getAll);
    this.router.get(`${this.path}types`, this.getTypes);
    this.router.get(`${this.path}:id`, this.getById);
    this.router.post(this.path, this.create);
    this.router.put(`${this.path}:id`, this.update);
    this.router.delete(this.path, this.delete);
  }

  public router = express.Router();

  private ds: DataSource;

  private path = '/';

  private create = async (request: express.Request, response: express.Response) => {
    console.log('tran create', request.body); //todo: типизировать body для запросов

    const tranToCreate = this.transformTranFromRequest(request);

    const tran = this.ds.manager.create(Transaction, tranToCreate);

    this.ds.manager
      .save(tran)
      .then((item) => {
        console.log('create - ok: ', item);
        response.send({ tran: item });
      })
      .catch((err) => {
        response.status(500);
        console.log('tran create error: ', err?.message);
        response.send({ message: err?.message });
      });
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
    const pageNumber = Number.isFinite(parseInt(request.query.page as string)) ? parseInt(request.query.page as string) : 0;

    console.log('Loading transactions from the database', request.query, pageNumber * PAGE_SIZE);

    const accounts = await this.ds.manager.find(Account, { where: { user: { id: Number(request.headers.userid) } } });
    const accountIds = accounts.map((acc) => acc.id);
    const transactions = await this.ds.manager.find(Transaction, {
      relations: ['account', 'category', 'type'],
      where: { account: In(accountIds) },
      order: {
        dt: 'DESC',
      },
      skip: 0 + pageNumber * PAGE_SIZE,
      take: PAGE_SIZE,
    });

    /*
    пример поиска юзера со связанными сущностям
    const userRepository = this.ds.getRepository(User);
    const transactions = await userRepository.findOne({
      relations: ['accounts', 'accounts.transactions'],
      where: { id: Number(request.headers.userid) },
    });
*/
    // console.log('Loaded transactions: ', transactions);
    setTimeout(() => {
      response.send(transactions);
    }, 1500);
  };

  private getById = async (request: express.Request, response: express.Response) => {
    const tranId = parseInt(request.params.id);

    try {
      const tran = await this.ds.manager.findOne(Transaction, {
        relations: ['account', 'toAccount', 'category', 'type'],
        where: { id: tranId },
      });

      /** todo: добавить проверку на принадлежность юзеру
      if (!(tran.account.user.id === Number(request.headers.userid))) {
        response.status(401);
        response.send('Not auth E3');
      }
       */

      response.send(tran);
    } catch (err) {
      response.status(500);
      console.log(err);
      response.send(err);
    }
  };

  private getTypes = async (request: express.Request, response: express.Response) => {
    console.log('Loading transaction types from the database...');

    const types = await this.ds.manager.find(TransactionType);

    console.log('Loaded types: ', types);
    response.send(types);
  };

  private async intialize() {
    await this.ds.createQueryBuilder().delete().from(TransactionType).execute();

    const type1 = new TransactionType();
    type1.id = ETRANSACTION_TYPE.EXPENSE;
    type1.name = 'Расход';

    const type2 = new TransactionType();
    type2.id = ETRANSACTION_TYPE.INCOME;
    type2.name = 'Доход';

    const type3 = new TransactionType();
    type3.id = ETRANSACTION_TYPE.RETURN_EXPENSE;
    type3.name = 'Возврат расхода';

    const type4 = new TransactionType();
    type4.id = ETRANSACTION_TYPE.RETURN_INCOME;
    type4.name = 'Возврат дохода';

    const type5 = new TransactionType();
    type5.id = ETRANSACTION_TYPE.TRANSFER;
    type5.name = 'Перевод между счетами';

    await this.ds.manager.save([type1, type2, type3, type4, type5]);
    console.log('TransactionTypes initialized');
  }

  private transformTranFromRequest(request: express.Request): Omit<Transaction, 'id'> {
    const tran: Omit<Transaction, 'id'> = {
      account: { id: request.body.accountId } as Account,
      amount: request.body.amount,
      description: request.body.description,
      dt: request.body.dt,
      type: { id: request.body.typeId },
    };

    if (request.body.typeId !== ETRANSACTION_TYPE.TRANSFER) {
      tran.category = { id: request.body.categoryId } as Category;
    } else {
      tran.toAccount = { id: request.body.toAccountId } as Account;
    }

    return tran;
  }

  private update = async (request: express.Request, response: express.Response) => {
    console.log('tran update', request.body);

    const tranToUpdate = this.transformTranFromRequest(request);

    try {
      const tran = await this.ds.manager.update(Transaction, parseInt(request.params.id), tranToUpdate);
      response.send({ tran: tran });
    } catch (err) {
      response.send(err);
    }
  };
}
