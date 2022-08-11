import { useQuery, useMutation, useQueryClient } from 'react-query';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { GetAccountsRequest } from '../server/routes/accounts';
import { AccountWithRest } from '../server/types/accounts';
import { getApi } from '../services/Api';

export const accountsQueryKey = 'accounts';

export const useAccounts = () => {
  const api = getApi();

  const queryClient = useQueryClient();

  const useGetAccountsList = (showHidden?: boolean) =>
    useQuery([accountsQueryKey, showHidden], () =>
      api.send<AccountWithRest[], null, GetAccountsRequest['query']>({
        endpoint: 'accounts',
        method: 'GET',
        query: { showHidden: showHidden ? '1' : '0' },
      })
    );

  const useGetOne = (id: number) =>
    useQuery([accountsQueryKey, 'details', id], () => api.send<AccountWithRest>({ endpoint: `accounts/${id}`, method: 'GET' }), {
      enabled: !!id,
    });

  const useCreate = () =>
    useMutation(
      (formValues: Record<string, unknown>) => {
        return api.send({
          data: formValues,
          endpoint: API_ENDPOINTS.ACCOUNTS,
          method: 'POST',
        });
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(accountsQueryKey);
        },
      }
    );

  const useItem = (method: 'POST' | 'PUT' | 'DELETE', params?: { id?: number; onSuccess?: () => void }) =>
    useMutation(
      (formValues: Record<string, unknown>) => {
        return api.send({
          data: formValues,
          endpoint: params?.id ? `accounts/${params.id}` : 'accounts',
          method: method,
        });
      },
      {
        onSuccess: async () => {
          console.log('useItem onSuccess', method);
          await queryClient.cancelQueries(accountsQueryKey);
          if (method === 'PUT' && params?.id) {
            queryClient.invalidateQueries([accountsQueryKey, 'details', params.id]);
          }

          queryClient.invalidateQueries(accountsQueryKey);
          params?.onSuccess && params?.onSuccess();
        },
      }
    );

  return { useCreate, useGetAccountsList, useGetOne, useItem };
};
