import { observer } from 'mobx-react-lite';
import React from 'react';
import { Transaction } from '../../server/entity/Transaction';

import styled from 'styled-components';
import { TransactionItem } from './TransactionItem';
import { T1 } from '../_shared/_base/Text';

const TransactionsGroupWrapper = styled.div`
  margin: 20px 0 20px 0;
`;

export const TransactionsGroup: React.VFC<{ date: string; transactions: Transaction[] }> = observer(({ date, transactions }) => (
  <TransactionsGroupWrapper>
    <T1>{date}</T1>
    {transactions.map((tran) => (
      <TransactionItem key={tran.id} tran={tran} showOnlyTime />
    ))}
  </TransactionsGroupWrapper>
));

TransactionsGroup.displayName = 'TransactionsGroup';
