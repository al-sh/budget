import { MinusOutlined, PlusOutlined, RollbackOutlined, RetweetOutlined } from '@ant-design/icons';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Transaction } from '../../server/entity/Transaction';
import { TransactionType } from '../../server/entity/TransactionType';
import { ETRANSACTION_TYPE } from '../../server/types/transactions';

import { UI_ROUTES } from '../../constants/urls';
import { formatDate } from '../../utils/format';

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

const TransactionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid black;
`;

const CategoryName = styled.span`
  margin-left: 0.5em;
  color: gray;
`;

const CurrencyName = styled.div`
  text-align: right;
  white-space: nowrap;
`;

const AccountName = styled.div`
  text-align: right;
  color: gray;
`;

export const TransactionItem: React.VFC<{ tran: Transaction }> = ({ tran }) => {
  const navigate = useNavigate();

  return (
    <TransactionWrapper
      onClick={() => {
        navigate(`${UI_ROUTES.TRANSACTIONS}/${tran.id}`);
      }}
    >
      <span>
        <div>
          <span>{tran.type && <TypeIcon type={tran.type} />}</span>

          <span>{tran.dt && formatDate(tran.dt)}</span>

          <CategoryName>{tran.type?.id !== ETRANSACTION_TYPE.TRANSFER ? tran?.category?.name : tran.type?.name}</CategoryName>
        </div>

        <span>{tran.description}</span>
      </span>

      <span>
        <CurrencyName>{tran.amount} RUB</CurrencyName>
        <AccountName>{tran.account?.name}</AccountName>
      </span>
    </TransactionWrapper>
  );
};
