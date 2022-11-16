import { observer } from 'mobx-react-lite';
import React from 'react';
import { Transaction } from '../../server/entity/Transaction';

import styled from 'styled-components';
import { TransactionItem } from './TransactionItem';

const TransactionsGroupWrapper = styled.div`
  margin: 20px 0 20px 0;
`;

const DateWrapper = styled.div`
  font-weight: bolder;
`;

export const TransactionsGroup: React.VFC<{ date: string; transactions: Transaction[] }> = observer(({ date, transactions }) => (
  <TransactionsGroupWrapper>
    <DateWrapper>{date}</DateWrapper>
    {transactions.map((tran) => (
      <TransactionItem key={tran.id} tran={tran} showOnlyTime />
    ))}
  </TransactionsGroupWrapper>
));

TransactionsGroup.displayName = 'TransactionsGroup';
