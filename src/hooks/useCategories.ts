import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Category } from '../server/entity/Category';
import { getApi } from '../services/Api';

export const categoriesQueryKey = ['categories'];

export const useCategories = () => {
  const api = getApi();

  const queryClient = useQueryClient();

  const useGetList = () => useQuery(categoriesQueryKey, () => api.send<Category[]>({ endpoint: 'categories', method: 'GET' }));

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

  const useDelete = () =>
    useMutation(
      (id: number) => {
        return api.send({
          data: {
            id: id,
          },
          endpoint: 'categories',
          method: 'DELETE',
        });
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(categoriesQueryKey);
        },
      }
    );

  return { useCreate, useDelete, useGetList };
};
