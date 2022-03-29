import { useQuery } from 'react-query';
import { Transaction } from '../server/entity/Transaction';
import { useApi } from '../services/Api';

// eslint-disable-next-line react-hooks/rules-of-hooks
const api = useApi();

export const transactionsQueryKey = ['transactions'];

export const useTransactions = () =>
  useQuery(transactionsQueryKey, () => api.send<Transaction[]>({ endpoint: 'transactions', method: 'GET' }));
