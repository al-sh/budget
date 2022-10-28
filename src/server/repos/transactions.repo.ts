import { DataSource, FindOptionsWhere, In } from 'typeorm';
import { PAGE_SIZE } from '../../constants/misc';
import { Optional } from '../../utils/utilityTypes';
import { Account } from '../entity/Account';
import { Category } from '../entity/Category';
import { Transaction } from '../entity/Transaction';
import { User } from '../entity/User';
import { buildPeriodFilterString } from '../utils/dates';
import { CategoriesRepo } from './categories.repo';

type TransactionToInsert = Optional<Transaction, 'toAccount' | 'category' | 'description'>;

export class TransactionsRepo {
  private static instance: TransactionsRepo;

  public static getInstance(ds: DataSource): TransactionsRepo {
    if (!TransactionsRepo.instance) {
      TransactionsRepo.instance = new TransactionsRepo(ds);
    }
    return TransactionsRepo.instance;
  }

  private constructor(ds: DataSource) {
    this.ds = ds;
    this.categoriesService = CategoriesRepo.getInstance(ds);
  }

  private categoriesService: CategoriesRepo;

  private ds: DataSource;

  public create(item: TransactionToInsert) {
    console.log('todo', item);
  }

  public getAll = async (
    userId: User['id'],
    params: {
      accountId?: Account['id'];
      categoryId?: Category['id'];
      dateEnd?: string;
      dateFrom?: string;
      pageNumber?: number;
      typeId: Category['type']['id'];
    }
  ) => {
    const accounts = await this.ds.manager.find(Account, { where: { user: { id: userId } } });

    const accountIds = accounts.map((acc) => acc.id);
    const whereClause: FindOptionsWhere<Transaction> = { account: { id: In(accountIds) } };

    const filterAccountId = params.accountId;
    if (filterAccountId) {
      if (accounts.find((acc) => acc.id === filterAccountId)) {
        whereClause.account = { id: filterAccountId };
      } else {
        const errMessage = `Данный счет не принадлежит данному клиенту! request.query.categoryId' ${filterAccountId} userId ${userId}`;
        console.error('TransactionsRepo getAll', errMessage);
        throw new Error(errMessage);
      }
    }

    //фильтрация по типу происходит через фильтрацию по категориям
    const categoriesWhereClause: FindOptionsWhere<Category> = { user: { id: userId } };

    if (Number.isFinite(params.typeId)) {
      categoriesWhereClause.type = { id: params.typeId };
    }

    const categories = await this.categoriesService.getAll(userId, false, params.typeId);

    const categoriesIds = categories.map((cat) => cat.id);
    whereClause.category = { id: In(categoriesIds) };
    const filterCategoryId = params?.categoryId;
    if (filterCategoryId) {
      if (categories.findIndex((cat) => cat.id === filterCategoryId) === -1) {
        const errMessage = `Данная категория не принадлежит данному клиенту! request.query.categoryId' ${filterCategoryId} userId ${userId}`;
        console.error('TransactionsRepo getAll', errMessage);
        throw new Error(errMessage);
      }
      const childrenCategories = categories.filter((cat) => cat.parentCategory?.id === filterCategoryId);
      const categoriesIds: Category['id'][] = [...childrenCategories.map((cat) => cat.id), filterCategoryId];
      whereClause.category = { id: In(categoriesIds) };
    }

    const dtFrom = params.dateFrom;
    const dtEnd = params.dateEnd;
    if (dtFrom || dtEnd) {
      whereClause.dt = buildPeriodFilterString(dtFrom, dtEnd);
    }

    const transactions = await this.ds.manager.find(Transaction, {
      relations: ['account', 'category', 'category.type'],
      where: whereClause,
      order: {
        dt: 'DESC',
      },
      ...(params.pageNumber && { skip: 0 + params.pageNumber * PAGE_SIZE, take: PAGE_SIZE }),
    });

    return transactions;
  };
}
