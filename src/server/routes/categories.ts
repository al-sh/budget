import * as express from 'express';
import { DataSource } from 'typeorm';
import { Category } from '../entity/Category';
import { ETRANSACTION_TYPE } from '../types/transactions';

export class CategoriesController {
  constructor(ds: DataSource) {
    this.ds = ds;

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
    console.log('cat create', request.body);

    const categoryToCreate: Omit<Category, 'id'> = {
      name: request.body.name as string,
      type: { id: parseInt(String(request.body.typeId)) },
      user: {
        id: parseInt(String(request.headers.userid)),
      },
    };

    const parentCategoryId = parseInt(String(request.body.parentCategoryId));
    if (Number.isFinite(parentCategoryId)) {
      categoryToCreate.parentCategory = { parentCategory: { id: parseInt(String(request.body.parentCategoryId)) } } as Category;
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
      where: { type: typeId ? { id: typeId } : undefined, user: { id: Number(request.headers.userid) } },
    });

    setTimeout(() => {
      response.send(categories);
    }, 1500);
  };

  private getById = async (request: express.Request, response: express.Response) => {
    const id = parseInt(request.params.id);

    const category = await this.ds.manager.findOne(Category, {
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

  private update = async (request: express.Request, response: express.Response) => {
    console.log('cat update', request.body);

    try {
      const tran = await this.ds.manager.update(Category, parseInt(request.params.id), request.body);
      response.send({ tran: tran });
    } catch (err) {
      response.send(err);
    }
  };
}
