import { DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTransactions } from '../../hooks/useTransactions';
import { Loader } from '../_shared/Loader';
import { TransactionForm } from './TransactionForm';

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
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5em' }}>
          <span>Редактирование транзакции</span>
          <span>
            <Button
              onClick={() => {
                useDeleleQuery.mutate(parseInt(transactionId));
                navigate('/transactions');
              }}
              type="primary"
              htmlType="submit"
              icon={<DeleteOutlined />}
            ></Button>
          </span>
        </div>
      )}
      {transactionId === 'new' && <div>Новая транзакция</div>}
      {!isFetching && <TransactionForm transaction={transaction} />}
    </>
  );
};

export default TransactionsPage;
