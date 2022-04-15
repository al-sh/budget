import React from 'react';
import { useParams } from 'react-router-dom';
import { useAccounts } from '../../hooks/useAccounts';
import { Loader } from '../_shared/Loader';
import { EditAccountForm } from './EditAccountForm';

export const AccountPage: React.VFC = () => {
  const { accountId } = useParams();
  const { useGetOne } = useAccounts();
  const { isFetching, data: account } = useGetOne(parseInt(accountId));

  return (
    <>
      {isFetching && <Loader />}
      {!isFetching && <EditAccountForm account={account} />}
    </>
  );
};

export default AccountPage;
