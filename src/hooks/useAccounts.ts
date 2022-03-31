import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Account } from '../server/entity/Account';
import { getApi } from '../services/Api';

export const accountsQueryKey = ['accounts'];

export const useAccounts = () => {
  const api = getApi();

  console.log('useAccounts');

  const queryClient = useQueryClient();

  const useGetList = () => useQuery(accountsQueryKey, () => api.send<Account[]>({ endpoint: 'accounts', method: 'GET' }));

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

  return { useCreate, useDelete, useGetList };
};
