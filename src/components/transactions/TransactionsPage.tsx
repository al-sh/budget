import React, { useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useApi } from '../../services/Api';
import { Account } from '../../server/entity/Account';
import { Button, Checkbox, Form, Input } from 'antd';

export const TransactionsPage: React.FC = () => {
  const api = useApi();
  const queryKey = useMemo(() => ['accounts'], []);
  const { isLoading, isError, data } = useQuery(queryKey, () => api.send<Account[]>({ endpoint: 'accounts', method: 'GET' }));

  const queryClient = useQueryClient();

  const handleFinish = useCallback(
    async (formValues) => {
      await api.send({
        data: formValues,
        endpoint: 'accounts',
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
        endpoint: 'accounts',
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
      {data.data.map((acc) => (
        <div key={acc.id}>
          <span>Название: {acc.name}</span>
          <span style={{ marginLeft: 10 }}>Активен: {acc.isActive ? 'Да' : 'Нет'}</span>
          <button
            onClick={() => {
              handleDelete(acc.id);
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
          layout="vertical"
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
          <Form.Item
            label="Название"
            name="name"
            rules={[
              {
                message: 'Введите название счета',
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="isActive" valuePropName="checked">
            <Checkbox>Активен</Checkbox>
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
