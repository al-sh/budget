import { useQuery } from 'react-query';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Category, ICategoryStatItem } from '../server/entity/Category';
import { GetAllCategoriesQuery, GetCategoriesTree } from '../server/routes/categories';
import { ETRANSACTION_TYPE } from '../server/types/transactions';
import { getApi } from '../services/Api';

export const statQueryKey = 'statistics';

export const useStatistics = () => {
  const api = getApi();

  const useGetList = (typeId?: ETRANSACTION_TYPE) =>
    useQuery(
      [statQueryKey, typeId],
      () =>
        api.send<Category[], null, GetAllCategoriesQuery>({
          endpoint: API_ENDPOINTS.STATISTICS.ALL,
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
      [statQueryKey, 'tree', typeId, showHidden],
      () =>
        api.send<ICategoryStatItem[], null, GetCategoriesTree['params']>({
          endpoint: API_ENDPOINTS.STATISTICS.TREE,
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

  return { useGetList, useGetTree };
};
