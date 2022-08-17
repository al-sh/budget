import React, { useMemo } from 'react';
import { Transaction } from '../../server/entity/Transaction';
import { formatDateShort } from '../../utils/format';
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

export const TransactionsListByDates: React.VFC<{ transactions: Transaction[] }> = ({ transactions }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const splitedTrans = useMemo(() => splitTransactionsByDate(transactions ? transactions : []), [JSON.stringify(transactions)]);
  const dates = [...splitedTrans.keys()];

  return <>{dates.length > 0 && dates.map((dt) => <TransactionsGroup key={dt} date={dt} transactions={splitedTrans.get(dt) || []} />)}</>;
};
