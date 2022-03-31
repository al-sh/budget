import { Button } from 'antd';
import React from 'react';
import { useTransactions } from '../../hooks/useTransactions';

export const TransactionsList: React.VFC = () => {
  const { useGetList: useGetTransactions, useDelete } = useTransactions();
  const useDeleleQuery = useDelete();
  const { isLoading, isError, data: transactions } = useGetTransactions();

  if (isLoading) return <>Transactions loading...</>;
  if (isError) return <>Error</>;

  return (
    <>
      {transactions.map((tran) => (
        <div key={tran.id}>
          <span>{tran.type.name}</span>
          <span>Сумма: {tran.amount}</span>
          <span>Описание: {tran.description}</span>
          <Button
            onClick={() => {
              useDeleleQuery.mutate(tran.id);
            }}
          >
            Удалить
          </Button>
        </div>
      ))}
    </>
  );
};
