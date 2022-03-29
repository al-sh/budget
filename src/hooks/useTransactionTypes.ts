import { useQuery } from 'react-query';
import { TransactionType } from '../server/entity/TransactionType';
import { useApi } from '../services/Api';

// eslint-disable-next-line react-hooks/rules-of-hooks
const api = useApi();

export const transactionTypesQueryKey = ['transactionTypes'];

export const useTransactionTypes = () =>
  useQuery(transactionTypesQueryKey, () => api.send<TransactionType[]>({ endpoint: 'transactions/types', method: 'GET' }));
