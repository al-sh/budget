import { Moment } from 'moment';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { formats } from '../constants/formats';
import { Transaction } from '../server/entity/Transaction';
import { GetTransactionsRequest } from '../server/routes/transactions';
import { getApi } from '../services/Api';

export type GetTransactionsQueryParams = {
  accountId?: number;
  categoryId?: number;
  dateEnd?: Moment;
  dateFrom?: Moment;
  pageNum?: number;
  typeId?: number;
};

export const transactionsQueryKey = 'transactions';

export const useTransactions = () => {
  const api = getApi();

  const queryClient = useQueryClient();

  const useGetList = (params: GetTransactionsQueryParams) => {
    const query: GetTransactionsRequest['query'] = { page: String(params.pageNum) };

    const accId = params.accountId;
    if (accId) {
      query.accountId = String(accId);
    }

    const categoryId = params.categoryId;
    if (categoryId) {
      query.categoryId = String(categoryId);
    }

    const dateFrom = params.dateFrom;
    if (dateFrom?.isValid()) {
      query.dateFrom = dateFrom.format(formats.dateMoment.short);
    }

    const dateEnd = params.dateEnd;
    if (dateEnd?.isValid()) {
      query.dateEnd = dateEnd.format(formats.dateMoment.short);
    }

    const typeId = params.typeId;
    if (typeId) {
      query.typeId = String(typeId);
    }

    return useQuery([transactionsQueryKey, JSON.stringify(query)], () =>
      api.send<Transaction[], null, GetTransactionsRequest['query']>({
        endpoint: 'transactions',
        method: 'GET',
        query: query,
      })
    );
  };

  const useGetOne = (id: number) =>
    useQuery([transactionsQueryKey, 'details', id], () => api.send<Transaction>({ endpoint: `transactions/${id}`, method: 'GET' }), {
      enabled: !!id,
    });

  const useItem = (method: 'POST' | 'PUT' | 'DELETE', params?: { id?: number; onSuccess?: () => void }) =>
    useMutation(
      (formValues: Record<string, unknown>) => {
        return api.send({
          data: formValues,
          endpoint: params?.id ? `${API_ENDPOINTS.TRANSACTIONS}/${params.id}` : API_ENDPOINTS.TRANSACTIONS,
          method: method,
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

  const useDelete = () =>
    useMutation(
      (id: number) => {
        return api.send({
          data: {
            id: id,
          },
          endpoint: API_ENDPOINTS.TRANSACTIONS,
          method: 'DELETE',
        });
      },
      {
        onMutate: async (id) => {
          // optimistic update
          const transactions: Transaction[] = queryClient.getQueryData(transactionsQueryKey) as Transaction[];
          queryClient.setQueryData(
            transactionsQueryKey,
            transactions.filter((item) => item.id !== id)
          );
          return {};
        },
        onSuccess: async () => {
          queryClient.invalidateQueries(transactionsQueryKey);
        },
      }
    );

  return { useDelete, useGetList, useGetOne, useItem };
};
