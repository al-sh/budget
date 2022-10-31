import * as express from 'express';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { Category, ICategoryTreeItem, ICategoryStatItem, CategoryWithAmount, CategoryWithAmountAndShare } from '../entity/Category';
import { Transaction } from '../entity/Transaction';
import { CategoriesRepo } from '../repos/categories.repo';
import { TransactionsRepo } from '../repos/transactions.repo';
import { StatisticsService } from '../services/statistics.service';
import { ETRANSACTION_TYPE } from '../types/transactions';
import { buildPeriodFilterString } from '../utils/dates';

export interface GetAllCategoriesRequest extends express.Request {
  query: {
    showHidden?: string;
    typeId?: string;
  };
}

export interface GetStatTree extends express.Request {
  query: {
    dateEnd?: string;
    dateFrom?: string;
    showHidden?: string;
    typeId?: string;
  };
}

export interface GetAllCategoriesQuery {
  showHidden?: string;
  typeId?: string;
}

export class StatisticsController {
  constructor(ds: DataSource) {
    this.ds = ds;
    this.categoriesRepo = CategoriesRepo.getInstance(ds);
    this.transactionsRepo = TransactionsRepo.getInstance(ds);
    this.statService = StatisticsService.getInstance(ds);

    this.router.get(`${this.path}tree`, this.getTreeStat);
  }

  public router = express.Router();

  private categoriesRepo: CategoriesRepo;

  private ds: DataSource;

  private path = '/';

  private statService: StatisticsService;

  private transactionsRepo: TransactionsRepo;

  private getTreeItem = (category: CategoryWithAmountAndShare, categories: CategoryWithAmountAndShare[]) => {
    const item: ICategoryStatItem = {
      title: category.name,
      id: category.id,
      key: category.id,
      value: category.id,
      isActive: category.isActive,
      selfAmount: category.selfAmount,
      totalAmount: category.totalAmount,
      share: category.share,
    };

    const children = categories.filter((item) => item.parentCategory?.id === category?.id);
    if (children?.length) {
      item.children = children.map((child) => this.getTreeItem(child, categories));
      if (category.selfAmount > 0) {
        (item.children as ICategoryStatItem[]).unshift({
          title: category.name + ' (общ)',
          id: category.id + '_general',
          key: category.id + '_general',
          value: category.id + '_general',
          isActive: category.isActive,
          selfAmount: category.selfAmount,
          totalAmount: category.selfAmount,
          share: (category.selfAmount * 100) / category.totalAmount,
        });
      }
    }

    return item;
  };

  private getTreeStat = async (request: GetStatTree, response: express.Response<ICategoryTreeItem[]>) => {
    const userId = Number(request.headers.userid);
    let typeId: ETRANSACTION_TYPE = parseInt(
      Array.isArray(request.query.typeId) ? request.query.typeId.join('') : (request.query.typeId as string)
    );

    if (typeId === ETRANSACTION_TYPE.RETURN_EXPENSE) typeId = ETRANSACTION_TYPE.EXPENSE;
    if (typeId === ETRANSACTION_TYPE.RETURN_INCOME) typeId = ETRANSACTION_TYPE.INCOME;

    const whereClause: FindOptionsWhere<Category> = {
      type: typeId ? { id: typeId } : undefined,
      user: { id: Number(request.headers.userid) },
      // transactions: {dt }
    };

    const showHidden = request.query.showHidden === '1';
    if (!showHidden) {
      whereClause.isActive = true;
    }

    const categoriesList = await this.categoriesRepo.getAll(userId, showHidden, typeId);

    const dtFrom = request.query.dateFrom;
    const dtEnd = request.query.dateEnd;

    const transactions = await this.transactionsRepo.getAll(userId, { dateEnd: dtEnd, dateFrom: dtFrom, typeId: typeId });

    const categoriesWithTransactions = categoriesList.map((category) => ({
      ...category,
      transactions: transactions.filter((tran) => tran.category?.id === category.id),
    }));

    const categoriesWithAmounts: CategoryWithAmount[] = categoriesWithTransactions.map((category) => {
      const amounts = this.statService.calculateAmount(category, categoriesWithTransactions);
      return { ...category, ...amounts };
    });

    console.log('categoriesWithAmounts', categoriesWithAmounts);

    const categoriesWithAmountsAndShares: CategoryWithAmountAndShare[] = categoriesWithAmounts.map((category) => ({
      ...category,
      share: this.statService.calculatePercents(category, categoriesWithAmounts),
    }));

    const tree = categoriesWithAmountsAndShares
      ?.filter((item) => !item.parentCategory)
      .map((itemWithoutParents) => this.getTreeItem(itemWithoutParents, categoriesWithAmountsAndShares));

    const totalAmount = this.statService.calculateTransactions(transactions);

    const totalItem: ICategoryStatItem = {
      id: 'total',
      key: 'total',
      value: 'Итого',
      title: 'Итого',
      share: 100,
      selfAmount: totalAmount,
      totalAmount: totalAmount,
    };
    tree.push(totalItem);

    setTimeout(() => {
      response.send(tree);
    }, 1500);
  };
}
