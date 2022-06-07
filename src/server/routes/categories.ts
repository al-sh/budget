import * as express from 'express';
import { DataSource } from 'typeorm';
import { Category, ICategoryTreeItem } from '../entity/Category';
import { ETRANSACTION_TYPE } from '../types/transactions';

export class CategoriesController {
  constructor(ds: DataSource) {
    this.ds = ds;

    this.router.get(this.path, this.getAll);
    this.router.get(`${this.path}tree`, this.getTree);
    this.router.get(`${this.path}:id`, this.getById);
    this.router.post(this.path, this.create);
    this.router.put(`${this.path}:id`, this.update);
    this.router.delete(this.path, this.delete);
  }

  public router = express.Router();

  private ds: DataSource;

  private path = '/';

  private create = async (request: express.Request, response: express.Response) => {
    console.log('cat create', request.body);

    const categoryToCreate: Omit<Category, 'id'> = {
      name: request.body.name as string,
      type: { id: parseInt(String(request.body.typeId)) },
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

  private delete = async (request: express.Request, response: express.Response) => {
    console.log('category delete', request.body);

    await this.ds
      .createQueryBuilder()
      .delete()
      .from(Category)
      .where('id = :id', { id: request.body.id })
      .execute()
      .then((cat) => {
        console.log('delete - ok');
        response.send({ category: cat });
      })
      .catch((err) => response.send(err));
  };

  private getAll = async (request: express.Request, response: express.Response) => {
    let typeId: ETRANSACTION_TYPE = parseInt(
      Array.isArray(request.query.typeId) ? request.query.typeId.join('') : (request.query.typeId as string)
    );

    if (typeId === ETRANSACTION_TYPE.RETURN_EXPENSE) typeId = ETRANSACTION_TYPE.EXPENSE;
    if (typeId === ETRANSACTION_TYPE.RETURN_INCOME) typeId = ETRANSACTION_TYPE.INCOME;

    const categories = await this.ds.manager.find(Category, {
      relations: ['type', 'childrenCategories', 'parentCategory'],
      where: { type: typeId ? { id: typeId } : undefined, user: { id: Number(request.headers.userid) }, isActive: true },
      order: {
        type: { name: 'ASC' },
        name: 'ASC',
      },
    });

    setTimeout(() => {
      response.send(categories);
    }, 1500);
  };

  private getById = async (request: express.Request, response: express.Response) => {
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

  private getTree = async (request: express.Request, response: express.Response<ICategoryTreeItem[]>) => {
    let typeId: ETRANSACTION_TYPE = parseInt(
      Array.isArray(request.query.typeId) ? request.query.typeId.join('') : (request.query.typeId as string)
    );

    if (typeId === ETRANSACTION_TYPE.RETURN_EXPENSE) typeId = ETRANSACTION_TYPE.EXPENSE;
    if (typeId === ETRANSACTION_TYPE.RETURN_INCOME) typeId = ETRANSACTION_TYPE.INCOME;

    const categories = await this.ds.manager.find(Category, {
      relations: ['type', 'parentCategory'],
      where: { type: typeId ? { id: typeId } : undefined, user: { id: Number(request.headers.userid) }, isActive: true },
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
    const item: ICategoryTreeItem = { title: category.name, value: category.id };
    const children = categories.filter((item) => item.parentCategory?.id === category?.id);
    if (children?.length) {
      item.children = children.map((child) => this.getTreeItem(child, categories));
    }

    return item;
  };

  private transformCategoryFromRequest(request: express.Request, categoryId?: number): Partial<Category> {
    const category: Partial<Category> = {
      name: request.body.name as string,
      type: { id: parseInt(String(request.body.typeId)) },
    };

    if (Number.isFinite(categoryId)) {
      category.id = categoryId;
    }

    const parentCategoryId = parseInt(String(request.body.parentCategory?.id));

    if (Number.isFinite(parentCategoryId)) {
      category.parentCategory = { id: parentCategoryId } as Category;
    }

    return category;
  }

  private update = async (request: express.Request, response: express.Response) => {
    console.log('cat update request.body:', request.body);

    const categoryId = parseInt(String(request.params.id));

    if (!Number.isFinite(categoryId)) {
      response.status(500);
      response.send({ message: 'cannot parse categoryId: ' + request.params.id });
      return;
    }

    const categoryToUpdate = this.transformCategoryFromRequest(request);

    try {
      const updatedCategory = await this.ds.manager.update(Category, categoryId, categoryToUpdate);
      response.send({ category: updatedCategory });
    } catch (err) {
      console.error(err);
      response.send(err);
    }
  };
}
