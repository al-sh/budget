import format from 'date-fns/format';
import * as express from 'express';
import fs from 'fs';
import multer from 'multer';
import { DataSource } from 'typeorm';
import { Account } from '../entity/Account';
import { Category } from '../entity/Category';
import { Transaction } from '../entity/Transaction';
import { BaseItemRequest } from '../types/api';

export class SyncController {
  constructor(ds: DataSource) {
    this.ds = ds;

    //TODO: проверять что в системе нет таких счетов/транзакций у других пользователей
    // вариант - сделать через просто удаление всех предыдущих счетов/категорий и insert новых (не использовать save)
    this.router.get(`${this.path}download/accounts`, this.exportAccounts);
    this.router.get(`${this.path}download/categories`, this.exportCategories);
    this.router.get(`${this.path}download/transactions`, this.exportTransactions);
    this.router.post(`${this.path}upload/accounts`, multer().single('fileData'), this.importAccounts);
    this.router.post(`${this.path}upload/categories`, multer().single('fileData'), this.importCategories);
    this.router.post(`${this.path}upload/transactions`, multer().single('fileData'), this.importTransactions);
  }

  public router = express.Router();

  private ds: DataSource;

  private path = '/';

  private exportAccounts = async (request: express.Request<BaseItemRequest>, response: express.Response) => {
    const getAccountsQuery = `SELECT id, name, "isActive", "initialValue", icon FROM account where "userId" = $1`;

    try {
      const queryRunner = await this.ds.createQueryRunner();
      const result = await queryRunner.manager.query(getAccountsQuery, [parseInt(String(request.headers.userid))]);

      response.send(result);
    } catch (err) {
      console.error('accounts export error: ', err);
      response.status(500);
      response.send({ message: `accounts export error`, additional: err });
    }
  };

  private exportCategories = async (request: express.Request<BaseItemRequest>, response: express.Response) => {
    const getCategoriesQuery = `SELECT id, name, "isActive", mpath, "typeId", "parentCategoryId" FROM category where "userId" = $1`;

    try {
      const queryRunner = await this.ds.createQueryRunner();
      const result = await queryRunner.manager.query(getCategoriesQuery, [parseInt(String(request.headers.userid))]);

      response.send(result);
    } catch (err) {
      console.error('category export error: ', err);
      response.status(500);
      response.send({ message: `category export error`, additional: err });
    }
  };

  private exportToFile = async (request: express.Request<BaseItemRequest>, response: express.Response) => {
    const getCategoriesQuery = `SELECT id, name, "isActive", mpath, "typeId", "parentCategoryId" FROM category where "userId" = ${request.headers.userid}`;
    const queryRunner = await this.ds.createQueryRunner();
    const result = await queryRunner.manager.query(getCategoriesQuery);

    const dt = new Date();
    const fileName = `${format(dt, 'yyyyMMdd_HHmmss')}`;
    const fileFullPath = `${__dirname}/${fileName}.txt`;

    fs.writeFile(fileFullPath, JSON.stringify(result), function (err) {
      if (err) {
        return console.log(err);
      }
      response.sendFile(fileFullPath);
      console.log('The file was saved!');
    });
  };

  private exportTransactions = async (request: express.Request<BaseItemRequest>, response: express.Response) => {
    const getTransactionsQuery = `SELECT description, amount, dt, "categoryId", id, "accountId", "toAccountId" FROM "transaction" where "categoryId" in (SELECT id FROM category c where c."userId"=$1)`;

    try {
      const queryRunner = await this.ds.createQueryRunner();
      const result = await queryRunner.manager.query(getTransactionsQuery, [parseInt(String(request.headers.userid))]);

      response.send(result);
    } catch (err) {
      console.error('transactions export error: ', err);
      response.status(500);
      response.send({ message: `transactions export error`, additional: err });
    }
  };

  private importAccounts = async (request: express.Request<BaseItemRequest>, response: express.Response) => {
    try {
      const accounts = JSON.parse(request.file?.buffer + '');
      if (!Array.isArray(accounts)) {
        response.status(500);
        response.send({ message: 'Некорректный формат файла' });
      }

      const itemsToCreate: Account[] = [];
      for (let i = 0; i < accounts.length; i++) {
        const itemFromFile = accounts[i];

        const newAcc = new Account();
        newAcc.id = itemFromFile.id;
        newAcc.name = itemFromFile.name;
        newAcc.isActive = itemFromFile.isActive;
        newAcc.initialValue = itemFromFile.initialValue;
        newAcc.icon = itemFromFile.icon;
        newAcc.user = { id: parseInt(String(request.headers.userid)) };
        itemsToCreate.push(newAcc);
      }

      await this.ds.manager.save(itemsToCreate);
      // this.ds.getRepository(Account).insert(itemsToCreate);
      response.send('importAccounts - ok');
    } catch (err) {
      console.error('accounts import error: ', err);
      response.status(500);
      response.send({ message: `accounts import error`, additional: err });
    }
  };

  private importCategories = async (request: express.Request<BaseItemRequest>, response: express.Response) => {
    try {
      // console.log('import!', request.file?.buffer + '');
      const categoriesFromFile = JSON.parse(request.file?.buffer + '');
      if (!Array.isArray(categoriesFromFile)) {
        response.status(500);
        response.send({ message: 'Некорректный формат файла' });
      }

      const itemsToCreate: Category[] = [];
      for (let i = 0; i < categoriesFromFile.length; i++) {
        const itemFromFile = categoriesFromFile[i];

        const newCat = new Category();
        newCat.id = itemFromFile.id;
        newCat.type = { id: itemFromFile.typeId };
        newCat.name = itemFromFile.name;
        newCat.user = { id: parseInt(String(request.headers.userid)) };
        newCat.parentCategory = { id: itemFromFile.parentCategoryId } as Category;
        itemsToCreate.push(newCat);
      }

      await this.ds.manager.save(itemsToCreate);
    } catch (err) {
      console.error('category import error: ', err);
      response.status(500);
      response.send({ message: `category import error`, additional: err });
    }
  };

  private importTransactions = async (request: express.Request<BaseItemRequest>, response: express.Response) => {
    try {
      const fileContent = JSON.parse(request.file?.buffer + '');
      if (!Array.isArray(fileContent)) {
        response.status(500);
        response.send({ message: 'Некорректный формат файла' });
      }

      const categories = await this.ds.manager.find(Category, {
        where: { user: { id: Number(request.headers.userid) } },
      });
      const categoriesIds = categories.map((category) => category.id);

      const accounts = await this.ds.manager.find(Account, {
        where: { user: { id: Number(request.headers.userid) } },
      });
      const accountIds = accounts.map((account) => account.id);

      const importErrors: { item: Transaction; message: string }[] = [];
      const itemsToCreate: Transaction[] = [];
      for (let i = 0; i < fileContent.length; i++) {
        const itemFromFile = fileContent[i];
        const newTran = new Transaction();
        newTran.id = itemFromFile.id;
        newTran.amount = itemFromFile.amount;
        newTran.description = itemFromFile.description;
        newTran.dt = itemFromFile.dt;

        if (!itemFromFile.accountId) {
          importErrors.push({ item: itemFromFile, message: 'accountId is null ' });
          continue;
        }
        if (!accountIds.includes(itemFromFile.accountId)) {
          importErrors.push({ item: itemFromFile, message: 'accountId not found' });
          continue;
        }
        newTran.account = { id: itemFromFile.accountId } as Account;

        if (itemFromFile.toAccountId && !accountIds.includes(itemFromFile.toAccountId)) {
          importErrors.push({ item: itemFromFile, message: 'toAccountId not found' });
          continue;
        }
        if (itemFromFile.toAccountId) {
          newTran.toAccount = { id: itemFromFile.toAccountId } as Account;
        }

        if (!categoriesIds.includes(itemFromFile.categoryId)) {
          importErrors.push({ item: itemFromFile, message: 'category not found' });
          continue;
        }
        newTran.category = { id: itemFromFile.categoryId } as Category;

        itemsToCreate.push(newTran);
      }

      await this.ds.manager.save(itemsToCreate);
      response.send({ imported: itemsToCreate.length, errors: importErrors });
    } catch (err) {
      console.error('transactions import error: ', err);
      response.status(500);
      response.send({ message: `transactions import error`, additional: err });
    }
  };
}
