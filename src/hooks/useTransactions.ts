import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Transaction } from '../server/entity/Transaction';
import { useApi } from '../services/Api';

export const transactionsQueryKey = ['transactions'];

export const useTransactions = () => {
  const api = useApi();

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

  return { useCreate, useGetList };
};
