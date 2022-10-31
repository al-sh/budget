import { useMutation, useQuery, useQueryClient } from 'react-query';
import { API_ROUTES } from '../constants/api-routes';
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
        endpoint: API_ROUTES.ACCOUNTS,
        method: 'GET',
        query: { showHidden: showHidden ? '1' : '0' },
      })
    );

  const useGetOne = (id: string) =>
    useQuery(
      [accountsQueryKey, 'details', id],
      () => api.send<AccountWithRest>({ endpoint: `${API_ROUTES.ACCOUNTS}/${id}`, method: 'GET' }),
      {
        enabled: !!id,
      }
    );

  const useCreate = () =>
    useMutation(
      (formValues: Record<string, unknown>) => {
        return api.send({
          data: { ...formValues, initialValue: Math.floor(parseFloat(formValues.initialValue as string) * 100) },
          endpoint: API_ROUTES.ACCOUNTS,
          method: 'POST',
        });
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(accountsQueryKey);
        },
      }
    );

  const useItem = (method: 'POST' | 'PUT' | 'DELETE', params?: { id?: string; onSuccess?: () => void }) =>
    useMutation(
      (formValues: Record<string, unknown>) => {
        return api.send({
          data: { ...formValues, initialValue: Math.floor(parseFloat(formValues.initialValue as string) * 100) },
          endpoint: params?.id ? `${API_ROUTES.ACCOUNTS}/${params.id}` : API_ROUTES.ACCOUNTS,
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
