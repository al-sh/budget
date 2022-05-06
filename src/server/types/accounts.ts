import { Account } from '../entity/Account';

export interface AccountWithRest extends Account {
  rest: number;
}
