import React, { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { transactionsQueryKey } from '../../hooks/useTransactions';
import { Transaction } from '../../server/entity/Transaction';
import { useApi } from '../../services/Api';

export const TransactionsList: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  const api = useApi();
  const queryClient = useQueryClient();

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
