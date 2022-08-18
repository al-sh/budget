import React, { useState } from 'react';
import { TransactionsFilters } from '../TransactionsFilters';
import { TransactionsListByDates } from '../TransactionsListByDates';

import { Button } from 'antd';
import styled from 'styled-components';
import { useTransactions } from '../../../hooks/useTransactions';
import { Loader } from '../../_shared/Loader';

const FilterButton = styled(Button)``;

export const TransactionsPage: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterAccountId, setFilterAccountId] = useState(0);
  const [filterCategorytId, setFilterCategorytId] = useState(0);
  const [filterTypeId, setFilterTypeId] = useState(0);
  const { useGetList: useGetTransactions } = useTransactions();
  const {
    isLoading,
    isError,
    data: transactions,
  } = useGetTransactions({ accountId: filterAccountId, categoryId: filterCategorytId, typeId: filterTypeId, pageNum: currentPage });

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
          accountId={filterAccountId}
          typeId={filterTypeId}
          categoryId={filterCategorytId}
          onFinish={(accId, typeId, catId) => {
            console.log('onFinish', accId, typeId, catId);
            setShowFilters(false);
            setFilterAccountId(accId || 0);
            setFilterTypeId(typeId || 0);
            setFilterCategorytId(catId || 0);
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
