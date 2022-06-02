import { AccountsList } from '../accounts/AccountsList';
import { TransactionsList } from '../transactions/TransactionsList';

export const MainPage = () => {
  return (
    <div>
      <h2>Счета</h2>
      <AccountsList fromMainPage />
      <h2>Последние транзакции</h2>
      <TransactionsList />
    </div>
  );
};
