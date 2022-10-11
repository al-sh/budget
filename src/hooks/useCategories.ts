import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Category, ICategoryTreeItem } from '../server/entity/Category';
import { getApi } from '../services/Api';
import { ETRANSACTION_TYPE } from '../server/types/transactions';
import { GetAllCategoriesQuery, GetCategoriesTree } from '../server/routes/categories';
import { API_ROUTES } from '../constants/api-routes';

export const categoriesQueryKey = 'categories';

export const useCategories = () => {
  const api = getApi();

  const queryClient = useQueryClient();

  const useGetList = (typeId?: ETRANSACTION_TYPE) =>
    useQuery(
      [categoriesQueryKey, typeId],
      () =>
        api.send<Category[], null, GetAllCategoriesQuery>({
          endpoint: API_ROUTES.CATEGORIES,
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
          endpoint: API_ROUTES.CATEGORIES + '/tree',
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
  const useGetOne = (id: string) =>
    useQuery(
      [categoriesQueryKey, id],
      () => api.send<Category, null, null>({ endpoint: `${API_ROUTES.CATEGORIES}/${id}`, method: 'GET' }),
      {
        enabled: !!id,
      }
    );

  const useItem = (method: 'POST' | 'PUT' | 'DELETE', id?: string, onSuccess?: () => void) =>
    useMutation(
      (formValues: Partial<Category>) => {
        return api.send<null, Partial<Category>, null>({
          data: formValues,
          endpoint: id ? `${API_ROUTES.CATEGORIES}/${id}` : API_ROUTES.CATEGORIES,
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
