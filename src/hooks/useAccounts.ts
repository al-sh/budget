import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Account } from '../server/entity/Account';
import { LocalAccount } from '../server/types/accounts';
import { getAccountsStore } from '../stores/AccountsStore';

export const accountsQueryKey = 'accounts';

export const useAccounts = () => {
  const accountsStore = getAccountsStore();

  const queryClient = useQueryClient();

  const useGetAccountsList = (showHidden?: boolean) => useQuery([accountsQueryKey, showHidden], () => accountsStore.getList(showHidden));

  const useGetOne = (id: string) =>
    useQuery([accountsQueryKey, 'details', id], () => accountsStore.getOne(id), {
      enabled: !!id,
    });

  const useItem = (method: 'POST' | 'PUT' | 'DELETE', params?: { id?: string; onSuccess?: () => void }) =>
    useMutation(
      (formValues: Record<string, unknown>) => {
        if (method === 'POST') {
          return accountsStore.create(formValues as unknown as Account);
        }

        if (method === 'DELETE' && params?.id) {
          return accountsStore.delete(params?.id);
        }

        if (method === 'PUT' && params?.id) {
          return accountsStore.update(params?.id, formValues as unknown as LocalAccount);
        }

        return new Promise<void>((_resolve, reject) => {
          console.error('accounts useItem method not found', method, params);
          reject();
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

  return { useGetAccountsList, useGetOne, useItem };
};
