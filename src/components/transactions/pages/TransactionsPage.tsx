import React, { useState } from 'react';
import { TransactionsFilters } from '../TransactionsFilters';
import { TransactionsListByDates } from '../TransactionsListByDates';

import { Button } from 'antd';
import { GetTransactionsQueryParams, useTransactions } from '../../../hooks/useTransactions';
import { FilterButton } from '../../_shared/buttons/FilterButton';
import { Loader } from '../../_shared/Loader';
import { ETRANSACTION_TYPE } from '../../../server/types/transactions';
import { useSearchParams } from 'react-router-dom';

export const TransactionsPage: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useSearchParams();
  const searchAsObject = Object.fromEntries(new URLSearchParams(search));
  const initialFilterParams: GetTransactionsQueryParams = {
    typeId: searchAsObject.typeId ? parseInt(searchAsObject.typeId) : ETRANSACTION_TYPE.EXPENSE,
  };
  if (String(searchAsObject.categoryId) !== 'undefined') {
    initialFilterParams.categoryId = searchAsObject.categoryId;
  }
  if (String(searchAsObject.accountId) !== 'undefined') {
    initialFilterParams.accountId = searchAsObject.accountId;
  }

  //todo: добавить даты
  const [filterParams, setFilterParams] = useState<GetTransactionsQueryParams>(initialFilterParams);

  const { useGetList: useGetTransactions } = useTransactions();
  const { isLoading, isError, data: transactions } = useGetTransactions(filterParams);

  return (
    <>
      <FilterButton
        onClick={() => {
          setShowFilters(!showFilters);
        }}
        showFilters={showFilters}
      />

      {showFilters && (
        <TransactionsFilters
          params={filterParams}
          onClear={() => {
            setShowFilters(false);
            setFilterParams({ ...{} });
          }}
          onFinish={(params) => {
            setShowFilters(false);
            setFilterParams(params);
            console.log('params', params);
            setSearch(params as URLSearchParams);
          }}
        />
      )}
      {isError && <>Ошибка загрузки транзакций</>}
      {isLoading && (
        <div style={{ textAlign: 'center', width: '100%' }}>
          <Loader size="large" />
        </div>
      )}
      {transactions && <TransactionsListByDates transactions={transactions} />}
      <div style={{ marginTop: '1rem' }}>
        <span style={{ marginRight: '0.5rem' }}>Страница: {currentPage + 1}</span>
        {currentPage > 0 && (
          <Button
            onClick={() => {
              setCurrentPage(currentPage - 1);
            }}
          >
            Предыдущая
          </Button>
        )}
        <Button
          onClick={() => {
            setCurrentPage(currentPage + 1);
          }}
        >
          Следующая
        </Button>
      </div>
    </>
  );
};

export default TransactionsPage;
