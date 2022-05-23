import React from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import { Loader } from '../_shared/Loader';
import { TransactionItem } from './TransactionItem';

export const TransactionsList: React.VFC = () => {
  const { useGetList: useGetTransactions } = useTransactions();
  const { isLoading, isError, data: transactions } = useGetTransactions();

  if (isLoading)
    return (
      <div style={{ textAlign: 'center', width: '100%' }}>
        <Loader size="large" />
      </div>
    );
  if (isError) return <>Error</>;

  return (
    <>
      {transactions.map((tran) => (
        <TransactionItem key={tran.id} tran={tran} />
      ))}
    </>
  );
};
