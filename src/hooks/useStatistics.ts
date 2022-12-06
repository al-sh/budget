import { Moment } from 'moment';
import { useQuery } from 'react-query';
import { API_ROUTES } from '../constants/api-routes';
import { formats } from '../constants/formats';
import { ICategoryStatItem } from '../server/entity/Category';
import { GetMonthStat, GetStatTree, MonthlyStatCategory } from '../server/routes/statistics';
import { ETRANSACTION_TYPE } from '../server/types/transactions';
import { getApi } from '../services/Api';

export interface GetStatTreeFormParams {
  dateFrom?: Moment;
  dateEnd?: Moment;
  showHidden?: boolean;
  typeId?: ETRANSACTION_TYPE;
}

export interface GetMonthStatParams {
  dateFrom?: Moment;
  dateEnd?: Moment;
  showHidden?: boolean;
  typeId?: ETRANSACTION_TYPE;
  categoryId?: string;
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
        endpoint: API_ROUTES.STATISTICS + '/tree',
        method: 'GET',
        query: query,
      })
    );
  };

  const useGraph = (params: GetMonthStatParams) => {
    const { dateFrom, dateEnd, typeId, showHidden } = params;
    const query: GetMonthStat['query'] = {};

    if (dateFrom?.isValid()) {
      query.dateFrom = dateFrom.format(formats.dateMoment.short);
    }

    if (dateEnd?.isValid()) {
      query.dateEnd = dateEnd.format(formats.dateMoment.short);
    }

    query.showHidden = showHidden ? '1' : '0';
    query.typeId = String(typeId);

    const categoryId = params.categoryId;
    if (categoryId) {
      query.categoryId = String(categoryId);
    }

    return useQuery([statQueryKey, 'graph', JSON.stringify(query)], () =>
      api.send<MonthlyStatCategory[], null, GetMonthStat['query']>({
        endpoint: API_ROUTES.STATISTICS + '/graph',
        method: 'GET',
        query: query,
      })
    );
  };

  return { useGetTree, useGraph };
};
