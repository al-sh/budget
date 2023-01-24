import { observer } from 'mobx-react-lite';
import React from 'react';

import styled from 'styled-components';
import { LocalTransactionWithNames } from '../../server/types/transactions';
import { T1 } from '../_shared/_base/Text';
import { TransactionItem } from './TransactionItem';

const TransactionsGroupWrapper = styled.div`
  margin: 20px 0 20px 0;
`;

export const TransactionsGroup: React.VFC<{ date: string; transactions: LocalTransactionWithNames[] }> = observer(
  ({ date, transactions }) => (
    <TransactionsGroupWrapper>
      <T1>{date}</T1>
      {transactions.map((tran) => (
        <TransactionItem key={tran.id} tran={tran} showOnlyTime />
      ))}
    </TransactionsGroupWrapper>
  )
);

TransactionsGroup.displayName = 'TransactionsGroup';
