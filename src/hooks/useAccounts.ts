import { useQuery, useMutation, useQueryClient } from 'react-query';
import { API_ENDPOINTS } from '../constants/urls';
import { Account } from '../server/entity/Account';
import { AccountWithRest } from '../server/types/accounts';
import { getApi } from '../services/Api';

export const accountsQueryKey = 'accounts';

export const useAccounts = () => {
  const api = getApi();

  const queryClient = useQueryClient();

  const useGetList = () => useQuery(accountsQueryKey, () => api.send<Account[]>({ endpoint: 'accounts', method: 'GET' }));

  const useGetOne = (id: number) =>
    useQuery([accountsQueryKey, id], () => api.send<AccountWithRest>({ endpoint: `accounts/${id}`, method: 'GET' }), { enabled: !!id });

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
            queryClient.invalidateQueries([accountsQueryKey, params.id]);
          }

          queryClient.invalidateQueries(accountsQueryKey);
          params?.onSuccess && params?.onSuccess();
        },
      }
    );

  return { useCreate, useGetList, useGetOne, useItem };
};
