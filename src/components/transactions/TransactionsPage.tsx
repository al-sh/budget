import React from 'react';
import { TransactionForm } from './TransactionForm';
import { TransactionsList } from './TransactionsList';

export const TransactionsPage: React.FC = () => {
  return (
    <>
      <TransactionsList />

      <div>Новая транзакция</div>
      <TransactionForm />
    </>
  );
};

export default TransactionsPage;
