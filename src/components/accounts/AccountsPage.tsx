import React from 'react';
import { AccountCreateForm } from './AccountCreateForm';
import { AccountsList } from './AccountsList';

export const AccountsPage: React.VFC = () => {
  return (
    <>
      <div>Счета</div>
      <AccountsList />

      <div>Новый счет</div>
      <AccountCreateForm />
    </>
  );
};

export default AccountsPage;
