import { MinusOutlined, PlusOutlined, RollbackOutlined, RetweetOutlined } from '@ant-design/icons';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Transaction } from '../../server/entity/Transaction';
import { TransactionType } from '../../server/entity/TransactionType';
import { ETRANSACTION_TYPE } from '../../server/types/transactions';
import format from 'date-fns/format';
import isValid from 'date-fns/isValid';
import { parseISO } from 'date-fns';
import { UI_ROUTES } from '../../constants/urls';

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

const formatDate = (dt: Date) => {
  if (!dt) {
    return '';
  }
  const newDt = parseISO(dt as unknown as string);
  if (!isValid(newDt)) {
    console.log('invalid date: ', newDt);
    return '';
  }
  return format(newDt, 'hh:mm dd.MM.yyyy');
};

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
          <span>
            <TypeIcon type={tran.type} />{' '}
          </span>

          <span>{formatDate(tran.dt)}</span>

          <span style={{ color: 'gray', marginLeft: '0.5em' }}>{tran?.category?.name}</span>
        </div>

        <span>{tran.description}</span>
      </span>

      <span>
        <div style={{ whiteSpace: 'nowrap' }}>{tran.amount} RUB</div>
        <div style={{ color: 'gray', textAlign: 'right' }}>{tran?.account?.name}</div>
      </span>
    </TransactionWrapper>
  );
};
