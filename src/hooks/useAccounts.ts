import { useQuery, useMutation, useQueryClient } from 'react-query';
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
          endpoint: 'accounts',
          method: 'POST',
        });
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(accountsQueryKey);
        },
      }
    );

  const useItem = (method: 'POST' | 'PUT' | 'DELETE', id?: number, onSuccess?: () => void) =>
    useMutation(
      (formValues: Record<string, unknown>) => {
        return api.send({
          data: formValues,
          endpoint: id ? `accounts/${id}` : 'accounts',
          method: method,
        });
      },
      {
        onSuccess: async () => {
          console.log('useItem onSuccess', method);
          await queryClient.cancelQueries(accountsQueryKey);
          queryClient.invalidateQueries([accountsQueryKey, id]);
          queryClient.invalidateQueries(accountsQueryKey);
          onSuccess && onSuccess();
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
          endpoint: 'accounts',
          method: 'DELETE',
        });
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(accountsQueryKey);
        },
      }
    );

  return { useCreate, useDelete, useGetList, useGetOne, useItem };
};
