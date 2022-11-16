import { MinusOutlined, PlusOutlined, RetweetOutlined, RollbackOutlined } from '@ant-design/icons';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Transaction } from '../../server/entity/Transaction';
import { TransactionType } from '../../server/entity/TransactionType';
import { ETRANSACTION_TYPE } from '../../server/types/transactions';

import { UI_ROUTES } from '../../constants/urls';
import { formatDate, formatMoney, formatOnlyTime } from '../../utils/format';
import { T2, T6 } from '../_shared/_base/Text';

const TypeIcon: React.VFC<{ type: TransactionType }> = ({ type }) => {
  return (
    <>
      {type.id === ETRANSACTION_TYPE.INCOME && <PlusOutlined />}
      {type.id === ETRANSACTION_TYPE.EXPENSE && <MinusOutlined />}
      {type.id === ETRANSACTION_TYPE.RETURN_EXPENSE && <RollbackOutlined />}
      {type.id === ETRANSACTION_TYPE.RETURN_INCOME && <RollbackOutlined />}
      {type.id === ETRANSACTION_TYPE.TRANSFER && <RetweetOutlined />}
    </>
  );
};

const TypeSymbol: React.VFC<{ type: TransactionType }> = ({ type }) => {
  return (
    <>
      {type.id === ETRANSACTION_TYPE.INCOME && '+'}
      {type.id === ETRANSACTION_TYPE.EXPENSE && '-'}
      {type.id === ETRANSACTION_TYPE.RETURN_EXPENSE && '+'}
      {type.id === ETRANSACTION_TYPE.RETURN_INCOME && '-'}
      {type.id === ETRANSACTION_TYPE.TRANSFER && '-'}
    </>
  );
};

const TransactionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid black;
`;

const CategoryName = styled.span`
  margin-left: 0.5em;
`;

const CurrencyName = styled.div`
  text-align: right;
  white-space: nowrap;
`;

const AccountName = styled.div`
  text-align: right;
`;

export const TransactionItem: React.VFC<{ tran: Transaction; showOnlyTime?: boolean }> = ({ tran, showOnlyTime }) => {
  const navigate = useNavigate();

  return (
    <TransactionWrapper
      onClick={() => {
        navigate(`${UI_ROUTES.TRANSACTIONS}/${tran.id}`);
      }}
    >
      <span>
        <div>
          <span></span>

          <T6>{tran.dt && showOnlyTime ? formatOnlyTime(tran.dt) : formatDate(tran.dt)}</T6>

          <CategoryName>
            <T2>{tran?.type?.id !== ETRANSACTION_TYPE.TRANSFER ? tran?.category?.name : 'Перевод на свой счет'}</T2>
          </CategoryName>
        </div>

        <T6>{tran.description}</T6>
      </span>

      <span>
        <CurrencyName>
          <T2>
            {tran?.type && <TypeSymbol type={tran?.type} />}
            {formatMoney(tran.amount)}
          </T2>
        </CurrencyName>
        <AccountName>
          <T6>{tran.account?.name}</T6>
        </AccountName>
      </span>
    </TransactionWrapper>
  );
};
