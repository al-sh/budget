import { Moment } from 'moment';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { LocalTransaction } from '../server/types/transactions';
import { getTrasactionsStore } from '../stores/TransactionsStore';

export type GetTransactionsQueryParams = {
  [i: string]: string | undefined | Moment | number;
  accountId?: string;
  categoryId?: string;
  dateEnd?: Moment;
  dateFrom?: Moment;
  pageNum?: number;
  typeId?: number;
};

export const transactionsQueryKey = 'transactions';

export const useTransactions = () => {
  const queryClient = useQueryClient();

  const transactionsStore = getTrasactionsStore();

  const useGetList = (params: GetTransactionsQueryParams) => {
    return useQuery([transactionsQueryKey, JSON.stringify(params)], () => transactionsStore.getList(params));
  };

  const useGetOne = (id: string) =>
    useQuery([transactionsQueryKey, 'details', id], () => transactionsStore.getOne(id), {
      enabled: !!id,
    });

  const useItem = (method: 'POST' | 'PUT' | 'DELETE', params?: { id?: string; onSuccess?: () => void }) =>
    useMutation(
      (formValues: Record<string, unknown>) => {
        if (method === 'POST') {
          return transactionsStore.create(formValues as unknown as LocalTransaction);
        }

        if (method === 'DELETE' && params?.id) {
          return transactionsStore.delete(params?.id);
        }

        if (method === 'PUT' && params?.id) {
          return transactionsStore.update(params?.id, formValues as unknown as LocalTransaction);
        }

        return new Promise<void>((_resolve, reject) => {
          console.error('transactions useItem method not found', method, params);
          reject();
        });
      },
      {
        onSuccess: async () => {
          console.log('useItem onSuccess', method);
          await queryClient.cancelQueries([transactionsQueryKey]);
          if (method === 'PUT' && params?.id) {
            queryClient.invalidateQueries([transactionsQueryKey, 'details', params.id]);
          }

          queryClient.invalidateQueries([transactionsQueryKey]);
          params?.onSuccess && params?.onSuccess();
        },
      }
    );

  return { useGetList, useGetOne, useItem };
};
