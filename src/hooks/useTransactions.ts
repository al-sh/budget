import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Transaction } from '../server/entity/Transaction';
import { getApi } from '../services/Api';

export const transactionsQueryKey = ['transactions'];

export const useTransactions = () => {
  const api = getApi();

  const queryClient = useQueryClient();

  const useGetList = () => useQuery(transactionsQueryKey, () => api.send<Transaction[]>({ endpoint: 'transactions', method: 'GET' }));

  const useCreate = () =>
    useMutation(
      (formValues: Record<string, unknown>) => {
        return api.send({
          data: formValues,
          endpoint: 'transactions',
          method: 'POST',
        });
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(transactionsQueryKey);
        },
      }
    );

  const useDelete = () =>
    useMutation(
      (id: number) => {
        return api.send({
          data: {
            id: id,
          },
          endpoint: 'transactions',
          method: 'DELETE',
        });
      },
      {
        onMutate: async (id) => {
          // optimistic update
          const transactions: Transaction[] = queryClient.getQueryData(transactionsQueryKey);
          queryClient.setQueryData(
            transactionsQueryKey,
            transactions.filter((item) => item.id !== id)
          );
          return {};
        },
        onSuccess: () => {
          queryClient.invalidateQueries(transactionsQueryKey);
        },
      }
    );

  return { useCreate, useDelete, useGetList };
};
