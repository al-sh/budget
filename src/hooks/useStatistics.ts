import { Moment } from 'moment';
import { useQuery } from 'react-query';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { formats } from '../constants/formats';
import { ICategoryStatItem } from '../server/entity/Category';
import { GetStatTree } from '../server/routes/statistics';
import { ETRANSACTION_TYPE } from '../server/types/transactions';
import { getApi } from '../services/Api';

export interface GetStatTreeFormParams {
  dateFrom?: Moment;
  dateEnd?: Moment;
  showHidden?: boolean;
  typeId?: ETRANSACTION_TYPE;
}

export const statQueryKey = 'statistics';

export const useStatistics = () => {
  const api = getApi();

  const useGetTree = (params: GetStatTreeFormParams) => {
    const { dateFrom, dateEnd, typeId, showHidden } = params;
    const query: GetStatTree['query'] = {};

    if (dateFrom?.isValid()) {
      query.dateFrom = dateFrom.format(formats.dateMoment.short);
    }

    if (dateEnd?.isValid()) {
      query.dateEnd = dateEnd.format(formats.dateMoment.short);
    }

    query.showHidden = showHidden ? '1' : '0';
    query.typeId = String(typeId);

    return useQuery([statQueryKey, 'tree', JSON.stringify(query)], () =>
      api.send<ICategoryStatItem[], null, GetStatTree['query']>({
        endpoint: API_ENDPOINTS.STATISTICS.TREE,
        method: 'GET',
        query: query,
      })
    );
  };

  return { useGetTree };
};
