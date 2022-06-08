import { Account } from '../entity/Account';

export interface AccountWithRest extends Omit<Account, 'initialValue'> {
  rest: number;
}
