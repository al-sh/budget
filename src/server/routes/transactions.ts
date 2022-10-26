import * as express from 'express';
import { DataSource, FindOptionsWhere, In, TypeORMError } from 'typeorm';
import { PAGE_SIZE } from '../../constants/misc';
import { Account } from '../entity/Account';
import { Category } from '../entity/Category';
import { Transaction } from '../entity/Transaction';
import { TransactionType } from '../entity/TransactionType';
import { ETRANSACTION_TYPE } from '../types/transactions';
import { buildPeriodFilterString } from '../utils/dates';

export interface GetTransactionTypesRequest extends express.Request {
  query: {
    hideReturns?: '1' | '0';
  };
}

export interface GetTransactionsRequest extends express.Request {
  query: {
    accountId?: string;
    categoryId?: string;
    dateEnd?: string;
    dateFrom?: string;
    page: string;
    typeId?: string;
  };
}

export class TransactionsController {
  constructor(ds: DataSource) {
    this.ds = ds;

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

    const tran = this.ds.manager.create(Transaction, { ...tranToCreate, user: { id: parseInt(String(request.headers.userid)) } });

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

  private getAll = async (request: GetTransactionsRequest, response: express.Response) => {
    const pageNumber = Number.isFinite(parseInt(request.query.page as string)) ? parseInt(request.query.page as string) : 0;

    console.log('Loading transactions from the database. Query: ', request.query);

    const accounts = await this.ds.manager.find(Account, { where: { user: { id: Number(request.headers.userid) } } });

    const accountIds = accounts.map((acc) => acc.id);
    const whereClause: FindOptionsWhere<Transaction> = { account: { id: In(accountIds) } };

    const filterAccountId = request.query.accountId;
    if (Number.isFinite(filterAccountId)) {
      if (accounts.find((acc) => acc.id === filterAccountId)) {
        whereClause.account = { id: filterAccountId };
      } else {
        console.error(
          'Данный счет не принадлежит данному клиенту! request.query.accountId',
          request.query.accountId,
          'request.headers.userid',
          request.headers.userid
        );
      }
    }

    //фильтрация по типу происходит через фильтрацию по категориям
    const categoriesWhereClause: FindOptionsWhere<Category> = { user: { id: Number(request.headers.userid) } };

    const filterTypeId = parseInt(request.query?.typeId || '');
    if (Number.isFinite(filterTypeId)) {
      categoriesWhereClause.type = { id: filterTypeId };
    }
    console.log('categoriesWhereClause', categoriesWhereClause);

    const categories = await this.ds.manager.find(Category, { where: categoriesWhereClause });

    const categoriesIds = categories.map((cat) => cat.id);
    whereClause.category = { id: In(categoriesIds) };
    const filterCategoryId = request.query?.categoryId;
    if (Number.isFinite(filterCategoryId)) {
      if (categories.findIndex((cat) => cat.id === filterCategoryId) === -1) {
        console.error(
          'Данная категория не принадлежит данному клиенту! request.query.categoryId',
          request.query.categoryId,
          'request.headers.userid',
          request.headers.userid
        );
        response.status(403);
        response.send({ message: 'Данная категория не принадлежит данному пользователю' });
        return;
      }
      whereClause.category = { id: filterCategoryId };
    }

    const dtFrom = request.query.dateFrom;
    const dtEnd = request.query.dateEnd;
    if (dtFrom || dtEnd) {
      whereClause.dt = buildPeriodFilterString(dtFrom, dtEnd);
    }

    const transactions = await this.ds.manager.find(Transaction, {
      relations: ['account', 'category', 'category.type'],
      where: whereClause,
      order: {
        dt: 'DESC',
      },
      skip: 0 + pageNumber * PAGE_SIZE,
      take: PAGE_SIZE,
    });

    setTimeout(() => {
      response.send(transactions);
    }, 1500);
  };

  private getById = async (request: express.Request, response: express.Response) => {
    const tranId = request.params.id;

    try {
      const tran = await this.ds.manager.findOne(Transaction, {
        relations: ['account', 'toAccount', 'category', 'category.type'],
        where: { id: tranId },
      });

      if (tran && tran.account && tran.account.user && !(tran.account?.user.id === Number(request.headers.userid))) {
        response.status(401);
        response.send('Not auth E3');
      }

      response.send(tran);
    } catch (err) {
      response.status(500);
      console.log('transactions getById error', err);
      response.send({ message: (err as TypeORMError)?.message });
    }
  };

  private getTypes = async (request: GetTransactionTypesRequest, response: express.Response) => {
    const hideReturns = request.query.hideReturns === '1';
    const types = await this.ds.manager.find(
      TransactionType,
      hideReturns ? { where: { id: In([ETRANSACTION_TYPE.EXPENSE, ETRANSACTION_TYPE.INCOME]) } } : undefined
    );

    response.send(types);
  };

  private transformTranFromRequest(request: express.Request): Omit<Transaction, 'id'> {
    //todo: проверка формата

    const tran: Omit<Transaction, 'id'> = {
      account: { id: request.body.accountId } as Account,
      amount: request.body.amount,
      description: request.body.description,
      dt: request.body.dt,
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
      const tran = await this.ds.manager.update(Transaction, request.params.id, tranToUpdate);
      response.send({ tran: tran });
    } catch (err) {
      console.error('tran update error', err);
      response.send(err);
    }
  };
}
