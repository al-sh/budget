import React, { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { transactionsQueryKey, useTransactions } from '../../hooks/useTransactions';
import { useApi } from '../../services/Api';

export const TransactionsList: React.VFC = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  const { useGetList: useGetTransactions } = useTransactions();
  const { isLoading, isError, data: transactions } = useGetTransactions();

  const handleDelete = useCallback(
    async (id: number) => {
      await api.send({
        data: {
          id: id,
        },
        endpoint: 'transactions',
        method: 'DELETE',
      });
      queryClient.invalidateQueries(transactionsQueryKey);
    },
    [api, queryClient]
  );

  if (isLoading) return <>Transactions loading...</>;
  if (isError) return <>Error</>;

  return (
    <>
      {transactions.map((tran) => (
        <div key={tran.id}>
          <span>{tran.type.name}</span>
          <span>Сумма: {tran.amount}</span>
          <span>Описание: {tran.description}</span>
          <button
            onClick={() => {
              handleDelete(tran.id);
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </>
  );
};
