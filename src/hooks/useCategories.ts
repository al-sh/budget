import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Category } from '../server/entity/Category';
import { LocalCategory } from '../server/types/categories';
import { ETRANSACTION_TYPE } from '../server/types/transactions';
import { getCategoriesStore } from '../stores/CategoriesStore';

export const categoriesQueryKey = 'categories';

export const useCategories = () => {
  const queryClient = useQueryClient();

  const categoriesStore = getCategoriesStore();

  const useGetTree = (params: { showHidden?: boolean; typeId?: ETRANSACTION_TYPE }) => {
    const { typeId, showHidden } = params;

    return useQuery([categoriesQueryKey, 'tree', typeId, showHidden], () => categoriesStore.getTree(typeId, showHidden));
  };

  const useGetOne = (id: string) =>
    useQuery([categoriesQueryKey, id], () => categoriesStore.getOne(id), {
      enabled: !!id,
    });

  const useItem = (method: 'PUT' | 'DELETE', id: string, onSuccess?: () => void) =>
    useMutation(
      (formValues: Record<string, unknown>) => {
        return method === 'PUT' ? categoriesStore.update(id, formValues as unknown as LocalCategory) : categoriesStore.delete(id);
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
        return categoriesStore.create(formValues);
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(categoriesQueryKey);
        },
      }
    );

  return { useCreate, useGetTree, useGetOne, useItem };
};
