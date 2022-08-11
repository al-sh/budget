import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Category, ICategoryTreeItem } from '../server/entity/Category';
import { getApi } from '../services/Api';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ETRANSACTION_TYPE } from '../server/types/transactions';
import { GetAllCategoriesQuery, GetCategoriesTree } from '../server/routes/categories';

export const categoriesQueryKey = 'categories';

export const useCategories = () => {
  const api = getApi();

  const queryClient = useQueryClient();

  const useGetList = (typeId?: ETRANSACTION_TYPE) =>
    useQuery(
      [categoriesQueryKey, typeId],
      () =>
        api.send<Category[], null, GetAllCategoriesQuery>({
          endpoint: API_ENDPOINTS.CATEGORIES.ALL,
          method: 'GET',
          query: { typeId: String(typeId) },
        })
      /*{
        enabled: !!typeId,
      }*/
    );

  const useGetTree = (params: { showHidden?: boolean; typeId?: ETRANSACTION_TYPE }) => {
    const { typeId, showHidden } = params;

    return useQuery(
      [categoriesQueryKey, 'tree', typeId, showHidden],
      () =>
        api.send<ICategoryTreeItem[], null, GetCategoriesTree['params']>({
          endpoint: API_ENDPOINTS.CATEGORIES.TREE,
          method: 'GET',
          query: {
            showHidden: showHidden ? '1' : '0',
            typeId: String(typeId),
          },
        })
      /*{
        enabled: !!typeId,
      }*/
    );
  };
  const useGetOne = (id: number) =>
    useQuery(
      [categoriesQueryKey, id],
      () => api.send<Category, null, null>({ endpoint: `${API_ENDPOINTS.CATEGORIES.ALL}/${id}`, method: 'GET' }),
      {
        enabled: !!id,
      }
    );

  const useItem = (method: 'POST' | 'PUT' | 'DELETE', id?: number, onSuccess?: () => void) =>
    useMutation(
      (formValues: Partial<Category>) => {
        return api.send<null, Partial<Category>, null>({
          data: formValues,
          endpoint: id ? `${API_ENDPOINTS.CATEGORIES.ALL}/${id}` : API_ENDPOINTS.CATEGORIES.ALL,
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
      (formValues: Category) => {
        return api.send<null, Category, null>({
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

  return { useCreate, useGetList, useGetTree, useGetOne, useItem };
};
