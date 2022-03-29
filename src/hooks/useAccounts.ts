import { useQuery } from 'react-query';
import { Account } from '../server/entity/Account';
import { useApi } from '../services/Api';

// eslint-disable-next-line react-hooks/rules-of-hooks
const api = useApi();

export const accountsQueryKey = ['accounts'];

export const useAccounts = () => useQuery(accountsQueryKey, () => api.send<Account[]>({ endpoint: 'accounts', method: 'GET' }));
