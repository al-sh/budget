import React, { useState } from 'react';
import { TransactionsFilters } from '../TransactionsFilters';
import { TransactionsListByDates } from '../TransactionsListByDates';

import { Button } from 'antd';
import moment from 'moment';
import { useSearchParams } from 'react-router-dom';
import { formats } from '../../../constants/formats';
import { GetTransactionsQueryParams, useTransactions } from '../../../hooks/useTransactions';
import { FilterButton } from '../../_shared/buttons/FilterButton';
import { Loader } from '../../_shared/Loader';

export const TransactionsPage: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useSearchParams();
  const searchAsObject = Object.fromEntries(new URLSearchParams(search));
  const initialFilterParams: GetTransactionsQueryParams = {
    typeId: searchAsObject.typeId ? parseInt(searchAsObject.typeId) : undefined,
  };
  if (String(searchAsObject.categoryId) !== 'undefined') {
    initialFilterParams.categoryId = searchAsObject.categoryId;
  }
  if (String(searchAsObject.accountId) !== 'undefined') {
    initialFilterParams.accountId = searchAsObject.accountId;
  }
  if (String(searchAsObject.dateFrom) !== 'undefined') {
    initialFilterParams.dateFrom = moment(searchAsObject.dateFrom);
  }
  if (String(searchAsObject.dateEnd) !== 'undefined') {
    initialFilterParams.dateEnd = moment(searchAsObject.dateEnd);
  }

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
            setSearch({
              ...params,
              dateFrom: params.dateFrom?.format(formats.dateMoment.short),
              dateEnd: params.dateEnd?.format(formats.dateMoment.short),
            } as unknown as URLSearchParams);
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
