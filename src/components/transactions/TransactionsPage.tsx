import React, { useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useApi } from '../../services/Api';
import { Button, Form, Input, InputNumber, Select } from 'antd';
import { Transaction } from '../../server/entity/Transaction';
import { useAccounts } from '../../hooks/useAccounts';
import { useTransactionTypes } from '../../hooks/useTransactionTypes';

export const TransactionsPage: React.FC = () => {
  const api = useApi();
  const queryKey = useMemo(() => ['transactions'], []);
  const { isLoading: isAccountsLoading, data: accounts } = useAccounts();
  const { isLoading: isTranTypesLoading, data: tranTypes } = useTransactionTypes();

  const { isLoading, isError, data } = useQuery(queryKey, () => api.send<Transaction[]>({ endpoint: 'transactions', method: 'GET' }));

  const queryClient = useQueryClient();

  const handleFinish = useCallback(
    async (formValues) => {
      await api.send({
        data: formValues,
        endpoint: 'transactions',
        method: 'POST',
      });
      queryClient.invalidateQueries(queryKey);
    },
    [api, queryClient, queryKey]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      await api.send({
        data: {
          id: id,
        },
        endpoint: 'transactions',
        method: 'DELETE',
      });
      queryClient.invalidateQueries(queryKey);
    },
    [api, queryClient, queryKey]
  );

  const onFinishFailed = useCallback((errorInfo) => {
    console.log('Failed:', errorInfo);
  }, []);

  if (isLoading) return <>Loading...</>;
  if (isError) return <>Error</>;

  return (
    <>
      <div>Транзакции</div>
      {data.map((tran) => (
        <div key={tran.id}>
          <span>{tran.type.name}</span>
          <span>Сумма: {tran.amount}</span>
          <span>Описание: {tran.description}</span>
          <button
            onClick={() => {
              handleDelete(tran.id);
            }}
          >
            Delete
          </button>
        </div>
      ))}

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
