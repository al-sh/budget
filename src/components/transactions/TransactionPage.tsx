import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTransactions } from '../../hooks/useTransactions';
import { Loader } from '../_shared/Loader';
import { TransactionForm } from './TransactionForm';
import { FormHeader } from '../_shared/forms/FormHeader';

export const TransactionsPage: React.FC = () => {
  const { transactionId } = useParams();
  const { useGetOne, useDelete } = useTransactions();
  const useDeleleQuery = useDelete();
  const { isFetching, data: transaction } = useGetOne(parseInt(transactionId));
  const navigate = useNavigate();

  return (
    <>
      {isFetching && <Loader />}
      {transactionId !== 'new' && (
        <FormHeader
          text="Редактирование транзакции"
          onDeleteButtonClick={() => {
            useDeleleQuery.mutate(parseInt(transactionId));
            navigate('/transactions');
          }}
        />
      )}
      {transactionId === 'new' && <div>Новая транзакция</div>}
      {!isFetching && <TransactionForm transaction={transaction} />}
    </>
  );
};

export default TransactionsPage;
