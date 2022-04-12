import React from 'react';
import { useParams } from 'react-router-dom';
import { useAccounts } from '../../hooks/useAccounts';
import { Loader } from '../_shared/Loader';
import { AccountForm } from './AccountForm';

export const AccountPage: React.VFC = () => {
  const { accountId } = useParams();
  const isNewAccount = !Number.isFinite(parseInt(accountId));

  const { useGetOne } = useAccounts();
  const { isLoading, data: account } = useGetOne(parseInt(accountId));

  return (
    <>
      <div>Счет</div>
      {isNewAccount && <AccountForm />}
      {!isNewAccount && isLoading && <Loader />}
      {!isNewAccount && !isLoading && <AccountForm account={account} />}
    </>
  );
};

export default AccountPage;
