import React from 'react';
import { TransactionForm } from './TransactionForm';
import { TransactionsList } from './TransactionsList';

export const TransactionsPage: React.FC = () => {
  return (
    <>
      <div>Транзакции</div>
      <TransactionsList />

      <div>Новая транзакция</div>
      <TransactionForm />
    </>
  );
};

export default TransactionsPage;
