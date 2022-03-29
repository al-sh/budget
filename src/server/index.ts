import dotenvFlow from 'dotenv-flow';
dotenvFlow.config();
console.log('env loaded');

import express from 'express';

import { AppDataSource } from './data-source';
import { AccountsController } from './routes/accounts';
import { AuthController } from './routes/auth';
import { TransactionsController } from './routes/transactions';

console.time('serverInit');

const app = express();
const port = 3001;

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Auth, UserId');

  next();
});
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

AppDataSource.initialize()
  .then(async () => {
    const authController = new AuthController(AppDataSource);
    app.use('/', authController.router);

    const accountsController = new AccountsController(AppDataSource);
    app.use('/accounts', accountsController.router);

    const transactionsController = new TransactionsController(AppDataSource);
    app.use('/transactions', transactionsController.router);

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
    console.timeEnd('serverInit');
  })
  .catch((error) => console.log(error));
