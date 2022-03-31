import * as express from 'express';
import { DataSource } from 'typeorm';
import { Category } from '../entity/Category';

export class CategoriesController {
  constructor(ds: DataSource) {
    this.ds = ds;

    this.router.get(this.path, this.getAll);
    this.router.post(this.path, this.create);
    this.router.delete(this.path, this.delete);
  }

  public router = express.Router();

  private ds: DataSource;

  private path = '/';

  private create = async (request: express.Request, response: express.Response) => {
    console.log('cat create', request.body);

    const category = this.ds.manager.create(Category, { ...request.body, user: { id: request.headers.userid } });

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
    console.log('Loading categories from the database...');

    const categories = await this.ds.manager.find(Category, { where: { user: { id: Number(request.headers.userid) } } });

    console.log('Loaded categories: ', categories);
    setTimeout(() => {
      response.send(categories);
    }, 1500);
  };
}
