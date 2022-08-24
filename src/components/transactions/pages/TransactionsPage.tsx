import React, { useState } from 'react';
import { TransactionsFilters } from '../TransactionsFilters';
import { TransactionsListByDates } from '../TransactionsListByDates';

import { Button } from 'antd';
import styled from 'styled-components';
import { GetTransactionsQueryParams, useTransactions } from '../../../hooks/useTransactions';
import { Loader } from '../../_shared/Loader';

const FilterButton = styled(Button)``;

export const TransactionsPage: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterParams, setFilterParams] = useState<GetTransactionsQueryParams>({});

  const { useGetList: useGetTransactions } = useTransactions();
  const { isLoading, isError, data: transactions } = useGetTransactions(filterParams);

  return (
    <>
      <FilterButton
        onClick={() => {
          setShowFilters(!showFilters);
        }}
      >
        {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
      </FilterButton>
      {showFilters && (
        <TransactionsFilters
          params={filterParams}
          onClear={() => {
            setShowFilters(false);
            setFilterParams({ ...{} });
          }}
          onFinish={(params) => {
            console.log('onFinish', params);
            setShowFilters(false);
            setFilterParams(params);
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
