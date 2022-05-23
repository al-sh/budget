import { Button } from 'antd';
import React, { useState } from 'react';
import { AccountNewForm } from './AccountNewForm';
import { AccountsList } from './AccountsList';

export const AccountsPage: React.VFC = () => {
  const [isAddAccount, setIsAddAccount] = useState(false);

  return (
    <>
      <AccountsList />
      <Button
        onClick={() => {
          setIsAddAccount(true);
        }}
      >
        Добавить
      </Button>
      {isAddAccount && (
        <AccountNewForm
          onFinish={() => {
            setIsAddAccount(false);
          }}
        />
      )}
    </>
  );
};

export default AccountsPage;
