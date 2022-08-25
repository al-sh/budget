/* eslint-disable sort-exports/sort-exports */
import * as express from 'express';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { Category, ICategoryTreeItem, ICategoryStatItem, CategoryWithAmount, CategoryWithAmountAndShare } from '../entity/Category';
import { Transaction } from '../entity/Transaction';
import { ETRANSACTION_TYPE } from '../types/transactions';

export interface GetAllCategoriesRequest extends express.Request {
  query: {
    showHidden?: string;
    typeId?: string;
  };
}

type GetCategoriesTreeParams = {
  showHidden: string;
  typeId: string;
};

export interface GetCategoriesTree extends express.Request {
  params: GetCategoriesTreeParams;
}

export interface GetAllCategoriesQuery {
  showHidden?: string;
  typeId?: string;
}

export class StatisticsController {
  constructor(ds: DataSource) {
    this.ds = ds;

    this.router.get(`${this.path}tree`, this.getTreeStat);
  }

  public router = express.Router();

  private ds: DataSource;

  private path = '/';

  private calculateAmount = (category: Category) => {
    let currentCategoryAmount = this.calculateTransactions(category.transactions || []);
    if (category.childrenCategories) {
      const childrenAmount = category.childrenCategories.reduce(
        (prev, current) => prev + this.calculateTransactions(current.transactions || []),
        0
      );
      currentCategoryAmount = currentCategoryAmount + childrenAmount;
    }
    return currentCategoryAmount;
  };

  private calculatePercents = (category: CategoryWithAmount, categories: CategoryWithAmount[]) => {
    const total = categories.reduce((prev, current) => {
      if (category?.parentCategory?.id === current?.parentCategory?.id) {
        return prev + current.amount;
      }

      return prev;
    }, 0);

    return total ? (category.amount * 100) / total : 0;
  };

  private calculateTransactions = (transactions: Transaction[]) => {
    // только для массива транзакций одной категории
    const rest = transactions.reduce((prev, current) => {
      if (
        current.category?.type?.id === ETRANSACTION_TYPE.RETURN_INCOME ||
        current.category?.type?.id === ETRANSACTION_TYPE.RETURN_EXPENSE
      ) {
        return prev - current.amount;
      }

      return prev + current.amount;
    }, 0);

    return rest;
  };

  private getTreeItem = (category: CategoryWithAmountAndShare, categories: CategoryWithAmountAndShare[]) => {
    const item: ICategoryStatItem = {
      title: category.name,
      id: category.id,
      key: category.id,
      value: category.id,
      isActive: category.isActive,
      amount: category.amount,
      share: category.share,
    };
    const children = categories.filter((item) => item.parentCategory?.id === category?.id);
    if (children?.length) {
      item.children = children.map((child) => this.getTreeItem(child, categories));
    }

    return item;
  };

  private getTreeStat = async (request: GetCategoriesTree, response: express.Response<ICategoryTreeItem[]>) => {
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

    const categories = await this.ds.manager.find(Category, {
      //  const categories  = await this.ds.manager.getTreeRepository(Category).findTrees({
      relations: ['type', 'parentCategory', 'transactions', 'childrenCategories', 'childrenCategories.transactions'],
      where: whereClause,
      order: {
        type: { name: 'ASC' },
        name: 'ASC',
      },
    });

    const categoriesWithAmounts: CategoryWithAmount[] = categories.map((category) => ({
      ...category,
      amount: this.calculateAmount(category),
    }));

    const categoriesWithAmountsAndShares: CategoryWithAmountAndShare[] = categoriesWithAmounts.map((category) => ({
      ...category,
      share: this.calculatePercents(category, categoriesWithAmounts),
    }));

    const tree = categoriesWithAmountsAndShares
      ?.filter((item) => !item.parentCategory)
      .map((itemWithoutParents) => this.getTreeItem(itemWithoutParents, categoriesWithAmountsAndShares));

    setTimeout(() => {
      response.send(tree);
    }, 1500);
  };
}
