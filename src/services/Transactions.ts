import { API_ROUTES } from '../constants/api-routes';
import { Transaction } from '../server/entity/Transaction';
import { ApiService, getApi } from './Api';

class TransactionsService {
  private static instance: TransactionsService;

  public static getInstance(): TransactionsService {
    if (!TransactionsService.instance) {
      TransactionsService.instance = new TransactionsService();
    }

    return TransactionsService.instance;
  }

  private constructor() {
    this.api = getApi();
  }

  private api: ApiService;

  public create(item: Transaction) {
    this.api.send({
      endpoint: API_ROUTES.TRANSACTIONS,
      method: 'POST',
      data: { ...item, amount: Math.round(item.amount * 100) },
    });
  }

  public update(item: Transaction) {
    this.api.send({
      endpoint: API_ROUTES.TRANSACTIONS + '/' + item.id,
      method: 'PUT',
      data: { ...item, amount: Math.round(item.amount * 100) },
    });
  }
}

export const getTrasactionsService = () => TransactionsService.getInstance();
