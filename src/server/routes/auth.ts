import * as express from 'express';
import * as crypto from 'crypto';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entity/User';
import { AUTH_PASSWORD_ENDPOINT } from '../../constants/urls';

const getPasswordHash = (password: string) =>
  crypto.pbkdf2Sync(password, 'testSalt', Number(process.env.CRYPTO_ITERATIONS), 32, 'sha256').toString('hex');

export class AuthController {
  constructor(ds: DataSource) {
    this.ds = ds;
    this.userRepository = this.ds.getRepository(User);

    if (process.env.DB_NEED_REINIT === 'yes') this.intializeUsers();
    this.router.use(this.checkTokenMiddleware);
    this.router.post(`${this.path}${AUTH_PASSWORD_ENDPOINT}`, this.handlePasswordAuth);
  }

  public router = express.Router();

  private ds: DataSource;

  private path = '/';

  private userRepository: Repository<User>;

  private checkTokenMiddleware = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    console.log('req:', request.path);
    if (request.method === 'OPTIONS' || request.path === `/${AUTH_PASSWORD_ENDPOINT}`) {
      next();
      return;
    }

    const reqToken = Array.isArray(request.headers.auth) ? request.headers.auth.join('') : request.headers.auth;
    const reqUserId = Number(Array.isArray(request.headers.userid) ? request.headers.userid.join('') : request.headers.userid);

    const user: User | null = await this.userRepository.findOne({ where: { id: reqUserId, isBlocked: false, token: reqToken } });
    if (user) {
      const reqAccountId = Number(Array.isArray(request.body.accountId) ? request.body.accountId.join('') : request.body.accountId);
      //TODO проверить reqAccountId на принадлежность текущему пользователю

      next();
    } else {
      response.status(401);
      response.send({ message: 'Not auth' });
      return;
    }
  };

  private handlePasswordAuth = async (request: express.Request, response: express.Response) => {
    console.log(request.body);

    const { login, password } = request.body;

    const user: User | null = await this.userRepository.findOne({ where: { isBlocked: false, login: login } });
    if (!user) {
      response.status(403);
      response.send({ message: 'Incorrect username or password.' });
      return;
    }
    console.log('find user:', user);

    const enteredPwdHash = getPasswordHash(password);

    if (!(user.passwordHash === enteredPwdHash)) {
      response.status(403);
      response.send({ message: 'Incorrect username or password.' });
      user.loginAttemts = user.loginAttemts + 1;
      if (user.loginAttemts >= 3) user.isBlocked = true;
      await this.userRepository.save(user);
      return;
    } else {
      user.loginAttemts = 0;
      const newToken = Math.random().toString(36).substring(2);
      user.token = newToken;
      await this.userRepository.save(user);
      const resp: AuthResponse = { token: newToken, userId: user.id };
      response.send(resp);
      return;
    }
  };

  private async intializeUsers() {
    await this.ds.createQueryBuilder().delete().from(User).execute();

    const user = new User();
    user.name = 'Demo User';
    user.login = 'demo';
    user.isBlocked = false;
    user.passwordHash = getPasswordHash('demo');

    await this.userRepository.save([user]);
    console.log('Saved a new user with id: ' + user.id);
  }
}

export interface AuthResponse {
  token: string;
  userId: number;
}
