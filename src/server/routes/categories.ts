/* eslint-disable sort-exports/sort-exports */
import * as express from 'express';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { Category, ICategoryTreeItem } from '../entity/Category';
import { BaseItemRequest, BaseUpdate } from '../types/api';
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

export class CategoriesController {
  constructor(ds: DataSource) {
    this.ds = ds;

    this.router.get(this.path, this.getAll);
    this.router.get(`${this.path}tree`, this.getTree);
    this.router.get(`${this.path}tree/stat`, this.getTreeStat);

    this.router.get(`${this.path}:id`, this.getById);
    this.router.post(this.path, this.create);
    this.router.put(`${this.path}:id`, this.update);
    this.router.delete(`${this.path}:id`, this.delete);
  }

  public router = express.Router();

  private ds: DataSource;

  private path = '/';

  private create = async (request: express.Request<null, null, Category>, response: express.Response) => {
    console.log('cat create', request.body);

    const categoryToCreate: Omit<Category, 'id'> = {
      name: request.body.name as string,
      type: { id: parseInt(String(request.body.type?.id)) },
      user: {
        id: parseInt(String(request.headers.userid)),
      },
    };

    const parentCategoryId = parseInt(String(request.body.parentCategory?.id));
    if (Number.isFinite(parentCategoryId)) {
      categoryToCreate.parentCategory = { id: parentCategoryId } as Category;
    }

    const category = this.ds.manager.create(Category, categoryToCreate);

    this.ds.manager
      .save(category)
      .then((cat) => {
        console.log('create - ok: ', category, cat);
        setTimeout(() => {
          response.send({ category: cat });
        }, 1500); //load emulation
      })
      .catch((err) => response.send(err));
  };

  private delete = async (request: express.Request<BaseItemRequest>, response: express.Response<BaseUpdate>) => {
    console.log('category delete', request.body);

    const categoryId = parseInt(request.params.id);

    if (!categoryId) {
      response.status(500);
      response.send({ message: `category delete error. request.params.id: ${request.params.id}` });
      return;
    }

    try {
      const res = await this.ds.manager.update(Category, categoryId, { isActive: false });
      response.send(res);
    } catch (err) {
      console.error('category delete error: ', err);
      response.send({ message: `category delete error. request.params.id: ${request.params.id}`, additional: err });
    }
  };

  private getAll = async (request: GetAllCategoriesRequest, response: express.Response<Category[]>) => {
    let typeId: ETRANSACTION_TYPE = parseInt(
      Array.isArray(request.query.typeId) ? request.query.typeId.join('') : (request.query.typeId as string)
    );

    if (typeId === ETRANSACTION_TYPE.RETURN_EXPENSE) typeId = ETRANSACTION_TYPE.EXPENSE;
    if (typeId === ETRANSACTION_TYPE.RETURN_INCOME) typeId = ETRANSACTION_TYPE.INCOME;

    const whereClause: FindOptionsWhere<Category> = {
      type: typeId ? { id: typeId } : undefined,
      user: { id: Number(request.headers.userid) },
    };

    const showHidden = request.query.showHidden === '1';
    if (!showHidden) {
      whereClause.isActive = true;
    }

    const categories = await this.ds.manager.find(Category, {
      relations: ['type', 'childrenCategories', 'parentCategory'],
      where: whereClause,
      order: {
        type: { name: 'ASC' },
        name: 'ASC',
      },
    });

    setTimeout(() => {
      response.send(categories);
    }, 1500);
  };

  private getById = async (request: express.Request<BaseItemRequest>, response: express.Response) => {
    const id = parseInt(request.params.id);

    const category = await this.ds.manager.findOne(Category, {
      relations: ['type', 'childrenCategories', 'parentCategory'],
      where: { id: id, user: { id: Number(request.headers.userid) } },
    });

    if (!category) {
      console.error('categories getById request.params.id', request.params.id, ' - not found');
      response.status(500);
      response.send('category not found');
    }

    setTimeout(() => {
      response.send(category);
    }, 1000);
  };

  private getTree = async (request: GetCategoriesTree, response: express.Response<ICategoryTreeItem[]>) => {
    let typeId: ETRANSACTION_TYPE = parseInt(
      Array.isArray(request.query.typeId) ? request.query.typeId.join('') : (request.query.typeId as string)
    );

    if (typeId === ETRANSACTION_TYPE.RETURN_EXPENSE) typeId = ETRANSACTION_TYPE.EXPENSE;
    if (typeId === ETRANSACTION_TYPE.RETURN_INCOME) typeId = ETRANSACTION_TYPE.INCOME;

    const whereClause: FindOptionsWhere<Category> = {
      type: typeId ? { id: typeId } : undefined,
      user: { id: Number(request.headers.userid) },
    };

    const showHidden = request.query.showHidden === '1';
    if (!showHidden) {
      whereClause.isActive = true;
    }

    const categories = await this.ds.manager.find(Category, {
      relations: ['type', 'parentCategory'],
      where: whereClause,
      order: {
        type: { name: 'ASC' },
        name: 'ASC',
      },
    });

    const tree = categories
      ?.filter((item) => !item.parentCategory)
      .map((itemWithoutParents) => this.getTreeItem(itemWithoutParents, categories));

    setTimeout(() => {
      response.send(tree);
    }, 1500);
  };

  private getTreeItem = (category: Category, categories: Category[]) => {
    const item: ICategoryTreeItem = {
      title: category.name,
      key: category.id,
      id: category.id,
      value: category.id,
      isActive: category.isActive,
      transactions: category.transactions,
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
      relations: ['type', 'parentCategory'],
      where: whereClause,
      order: {
        type: { name: 'ASC' },
        name: 'ASC',
      },
    });

    const tree = categories
      ?.filter((item) => !item.parentCategory)
      .map((itemWithoutParents) => this.getTreeItem(itemWithoutParents, categories));

    setTimeout(() => {
      response.send(tree);
    }, 1500);
  };

  private update = async (request: express.Request<BaseItemRequest, null, Partial<Category>>, response: express.Response<BaseUpdate>) => {
    console.log('cat update request.body:', request.body);

    const categoryId = parseInt(String(request.params.id));

    if (!Number.isFinite(categoryId)) {
      response.status(500);
      response.send({ message: 'cannot parse categoryId: ' + request.params.id });
      return;
    }

    // редактирование типа удалено, т.к. лишено всякой логики и может создать в дальнейшем ошибки
    const categoryToUpdate: Partial<Category> = {
      name: request.body.name as string,
      isActive: request.body.isActive,
    };

    if (Number.isFinite(categoryId)) {
      categoryToUpdate.id = categoryId;
    }

    const parentCategoryId = parseInt(String(request.body.parentCategory?.id));

    if (Number.isFinite(parentCategoryId)) {
      categoryToUpdate.parentCategory = { id: parentCategoryId } as Category;
    } else {
      categoryToUpdate.parentCategory = { id: undefined } as unknown as Category;
    }

    try {
      const updatedCategory = await this.ds.manager.update(Category, categoryId, categoryToUpdate);
      response.send(updatedCategory);
    } catch (err) {
      console.error(err);
      response.send({ message: 'category update error', additional: err });
    }
  };
}
