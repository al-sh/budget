import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Category } from '../server/entity/Category';
import { getApi } from '../services/Api';
import { API_ENDPOINTS } from '../constants/urls';
import { ETRANSACTION_TYPE } from '../server/types/transactions';

export const categoriesQueryKey = ['categories'];

export const useCategories = () => {
  const api = getApi();

  const queryClient = useQueryClient();

  const useGetList = (typeId?: ETRANSACTION_TYPE) =>
    useQuery(
      [...categoriesQueryKey, typeId],
      () => api.send<Category[]>({ endpoint: API_ENDPOINTS.CATEGORIES, method: 'GET', query: { typeId: String(typeId) } })
      /*{
        enabled: !!typeId,
      }*/
    );

  const useGetOne = (id: number) =>
    useQuery([categoriesQueryKey, id], () => api.send<Category>({ endpoint: `${API_ENDPOINTS.CATEGORIES}/${id}`, method: 'GET' }), {
      enabled: !!id,
    });

  const useItem = (method: 'POST' | 'PUT' | 'DELETE', id?: number, onSuccess?: () => void) =>
    useMutation(
      (formValues: Record<string, unknown>) => {
        return api.send({
          data: formValues,
          endpoint: id ? `${API_ENDPOINTS.CATEGORIES}/${id}` : API_ENDPOINTS.CATEGORIES,
          method: method,
        });
      },
      {
        onSuccess: async () => {
          console.log('useItem onSuccess', method);
          await queryClient.cancelQueries(categoriesQueryKey);
          queryClient.invalidateQueries([categoriesQueryKey, id]);
          queryClient.invalidateQueries(categoriesQueryKey);
          onSuccess && onSuccess();
        },
      }
    );

  const useCreate = () =>
    useMutation(
      (formValues: Record<string, unknown>) => {
        return api.send({
          data: formValues,
          endpoint: 'categories',
          method: 'POST',
        });
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(categoriesQueryKey);
        },
      }
    );

  return { useCreate, useGetList, useGetOne, useItem };
};
