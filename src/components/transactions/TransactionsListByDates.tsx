import { Button } from 'antd';
import React, { useMemo, useState } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import { Transaction } from '../../server/entity/Transaction';
import { formatDateShort } from '../../utils/format';
import { Loader } from '../_shared/Loader';
import { TransactionsGroup } from './TransactionsGroup';

const splitTransactionsByDate: (transactions: Transaction[]) => Map<string, Transaction[]> = (transactions: Transaction[]) => {
  const res: Map<string, Transaction[]> = new Map();

  for (let i = 0; i < transactions.length; i++) {
    const shortDt = formatDateShort(transactions[i].dt);
    if (!res.get(shortDt)) {
      res.set(shortDt, []);
    }
    res.get(shortDt)?.push(transactions[i]);
  }
  return res;
};

export const TransactionsListByDates: React.VFC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { useGetList: useGetTransactions } = useTransactions();
  const { isLoading, isError, data: transactions } = useGetTransactions(currentPage);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const splitedTrans = useMemo(() => splitTransactionsByDate(transactions ? transactions : []), [JSON.stringify(transactions)]);
  const dates = [...splitedTrans.keys()];

  if (isLoading)
    return (
      <div style={{ textAlign: 'center', width: '100%' }}>
        <Loader size="large" />
      </div>
    );
  if (isError) return <>Error</>;

  return (
    <>
      {dates.length > 0 && dates.map((dt) => <TransactionsGroup key={dt} date={dt} transactions={splitedTrans.get(dt) || []} />)}
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
