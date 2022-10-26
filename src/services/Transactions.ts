import { API_ROUTES } from '../constants/api-routes';
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

  public create(item: any) {
    this.api.send({
      endpoint: API_ROUTES.TRANSACTIONS,
      method: 'POST',
      data: { ...item, amount: Math.floor(parseFloat(item.amount as string) * 100) },
    });
  }
}

export const getTrasactionsService = () => TransactionsService.getInstance();
