import { Button } from 'antd';
import React, { useState } from 'react';
import { AccountForm } from './AccountForm';
import { AccountsList } from './AccountsList';

export const AccountsPage: React.VFC = () => {
  const [isAddAccount, setIsAddAccount] = useState(false);

  console.log('selectedAccountId', isAddAccount);

  return (
    <>
      <div>Счета</div>
      <AccountsList />
      <Button
        onClick={() => {
          setIsAddAccount(true);
        }}
      >
        Добавить
      </Button>
      {isAddAccount && <AccountForm />}
    </>
  );
};

export default AccountsPage;
