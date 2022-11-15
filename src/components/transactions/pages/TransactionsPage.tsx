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

import styled from 'styled-components';

const HeaderBlock = styled.div`
  height: 64px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(180deg, #008f8c 0%, #0fc2c0 100%);
  border-radius: 0px 0px 5px 5px;
  padding: 12px;
`;

const HeaderTitle = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;

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
      <HeaderBlock>
        <HeaderTitle>История</HeaderTitle>
        <FilterButton
          onClick={() => {
            setShowFilters(!showFilters);
          }}
          showFilters={showFilters}
        />
      </HeaderBlock>

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
            const paramsForSearch: GetTransactionsQueryParams = {};
            for (const key in params) {
              if (params[key as keyof GetTransactionsQueryParams] !== undefined) {
                const key1 = key as keyof GetTransactionsQueryParams;
                paramsForSearch[key1] = params[key1];
              }
            }

            setSearch({
              ...paramsForSearch,
              ...(paramsForSearch.dateFrom && { dateFrom: paramsForSearch.dateFrom.format(formats.dateMoment.short) }),
              ...(paramsForSearch.dateEnd && { dateEnd: paramsForSearch.dateEnd.format(formats.dateMoment.short) }),
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
