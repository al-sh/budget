import { useQuery } from 'react-query';
import { TransactionType } from '../server/entity/TransactionType';
import { getApi } from '../services/Api';

const api = getApi();

export const transactionTypesQueryKey = ['transactionTypes'];

export const useTransactionTypes = () =>
  useQuery(transactionTypesQueryKey, () => api.send<TransactionType[]>({ endpoint: 'transactions/types', method: 'GET' }));
