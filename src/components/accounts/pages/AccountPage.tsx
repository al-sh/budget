import React from 'react';
import { useParams } from 'react-router-dom';
import { useAccounts } from '../../../hooks/useAccounts';
import { Loader } from '../../_shared/Loader';
import { EditAccountForm } from '../EditAccountForm';

export const AccountPage: React.VFC = () => {
  const params = useParams();
  const accountId = params?.accountId ? params?.accountId : '';
  const { useGetOne } = useAccounts();
  const { isFetching, isError, data: account } = useGetOne(parseInt(accountId));

  return (
    <>
      {isFetching && <Loader />}
      {(isError || !account) && <div>Ошибка загрузки счета</div>}
      {!isFetching && !isError && account && <EditAccountForm account={account} />}
    </>
  );
};

export default AccountPage;
