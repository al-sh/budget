import React, { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { useApi } from '../../services/Api';
import { Button, Form, Input, InputNumber, Select } from 'antd';
import { useAccounts } from '../../hooks/useAccounts';
import { useTransactionTypes } from '../../hooks/useTransactionTypes';
import { transactionsQueryKey, useTransactions } from '../../hooks/useTransactions';
import { TransactionsList } from './TransactionsList';

export const TransactionsPage: React.FC = () => {
  const api = useApi();
  const { isLoading: isAccountsLoading, data: accounts } = useAccounts().useGetList();
  const { isLoading: isTranTypesLoading, data: tranTypes } = useTransactionTypes();

  const { isLoading, isError, data: transactions } = useTransactions();

  const queryClient = useQueryClient();

  const handleFinish = useCallback(
    async (formValues) => {
      await api.send({
        data: formValues,
        endpoint: 'transactions',
        method: 'POST',
      });
      queryClient.invalidateQueries(transactionsQueryKey);
    },
    [api, queryClient]
  );

  const onFinishFailed = useCallback((errorInfo) => {
    console.log('Failed:', errorInfo);
  }, []);

  if (isLoading) return <>Loading...</>;
  if (isError) return <>Error</>;

  return (
    <>
      <div>Транзакции</div>
      <TransactionsList transactions={transactions} />

      <div>Новая транзакция</div>
      <div style={{ width: 400 }}>
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          layout="horizontal"
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            isActive: true,
            name: '',
          }}
          onFinish={handleFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item label="Сумма" name="amount">
            <InputNumber
              style={{
                width: 300,
              }}
            />
          </Form.Item>

          <Form.Item label="Описание" name="description">
            <Input />
          </Form.Item>

          <Form.Item label="Тип" name="typeId">
            <Select loading={isTranTypesLoading}>
              {tranTypes.map((tran) => (
                <Select.Option key={tran.id} value={tran.id}>
                  {tran.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Счет" name="accountId">
            <Select loading={isAccountsLoading}>
              {accounts.map((acc) => (
                <Select.Option key={acc.id} value={acc.id}>
                  {acc.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Добавить
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};
