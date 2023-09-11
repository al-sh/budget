import { Button } from 'antd';
import React, { useState } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import { Loader } from '../_shared/Loader';
import { TransactionItem } from './TransactionItem';

export const TransactionsList: React.VFC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { useGetList: useGetTransactions } = useTransactions();
  const { isLoading, isError, data: transactions } = useGetTransactions({ pageNum: currentPage });

  if (isLoading)
    return (
      <div style={{ textAlign: 'center', width: '100%' }}>
        <Loader size="large" />
      </div>
    );
  if (isError) return <>Error</>;

  return (
    <>
      {transactions?.length === 0 && 'Список пуст'}
      {transactions?.map((tran) => (
        <TransactionItem key={tran.id} tran={tran} />
      ))}
      <div style={{ marginTop: '1rem' }}>
        <span style={{ marginRight: '0.5rem' }}>Страница: {currentPage}</span>
        {currentPage > 1 && (
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
