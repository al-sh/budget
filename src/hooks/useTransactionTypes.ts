import { useQuery } from 'react-query';
import { TransactionType } from '../server/entity/TransactionType';
import { GetTransactionTypesRequest } from '../server/routes/transactions';
import { getApi } from '../services/Api';

const api = getApi();

export const transactionTypesQueryKey = ['transactionTypes'];

export const useTransactionTypes = (hideReturns?: boolean) =>
  useQuery([transactionTypesQueryKey, hideReturns], () =>
    api.send<TransactionType[], null, GetTransactionTypesRequest['query']>({
      endpoint: 'transactions/types',
      method: 'GET',
      query: { hideReturns: hideReturns ? '1' : '0' },
    })
  );
