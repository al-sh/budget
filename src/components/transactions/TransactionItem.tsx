import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ETRANSACTION_TYPE, LocalTransactionWithNames } from '../../server/types/transactions';

import { UI_ROUTES } from '../../constants/urls';
import { formatDateISOstr, formatMoney, formatOnlyTimeISOstr } from '../../utils/format';
import { T2, T6 } from '../_shared/_base/Text';

const TypeSymbol: React.VFC<{ typeId: ETRANSACTION_TYPE }> = ({ typeId }) => {
  return (
    <>
      {typeId === ETRANSACTION_TYPE.INCOME && '+'}
      {typeId === ETRANSACTION_TYPE.EXPENSE && '-'}
      {typeId === ETRANSACTION_TYPE.RETURN_EXPENSE && '+'}
      {typeId === ETRANSACTION_TYPE.RETURN_INCOME && '-'}
      {typeId === ETRANSACTION_TYPE.TRANSFER && ' '}
    </>
  );
};

const TransactionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid #f5f5f5;
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

export const TransactionItem: React.VFC<{ tran: LocalTransactionWithNames; showOnlyTime?: boolean }> = ({ tran, showOnlyTime }) => {
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

          <T6>{tran.dt && showOnlyTime ? formatOnlyTimeISOstr(tran.dt) : formatDateISOstr(tran.dt)}</T6>

          <CategoryName>
            <T2>{tran?.typeId !== ETRANSACTION_TYPE.TRANSFER ? tran.categoryName : 'Перевод на свой счет'}</T2>
          </CategoryName>
        </div>

        <T6>{tran.description}</T6>
      </span>

      <span>
        <CurrencyName>
          <T2>
            {tran?.typeId && <TypeSymbol typeId={tran?.typeId} />}
            {formatMoney(tran.amount)}
          </T2>
        </CurrencyName>
        <AccountName>
          <T6>{tran.accountName}</T6>
        </AccountName>
      </span>
    </TransactionWrapper>
  );
};
