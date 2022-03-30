import { Form, InputNumber, Input, Select, Button } from 'antd';
import { useAccounts } from '../../hooks/useAccounts';
import { useTransactions } from '../../hooks/useTransactions';
import { useTransactionTypes } from '../../hooks/useTransactionTypes';

export const TransactionForm: React.VFC = () => {
  const { isLoading: isAccountsLoading, data: accounts } = useAccounts().useGetList();
  const { isLoading: isTranTypesLoading, data: tranTypes } = useTransactionTypes();
  const createTransactionQuery = useTransactions().useCreate();

  return (
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
        onFinish={(formValues) => createTransactionQuery.mutate(formValues)}
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
            {tranTypes?.map((tran) => (
              <Select.Option key={tran.id} value={tran.id}>
                {tran.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Счет" name="accountId">
          <Select loading={isAccountsLoading}>
            {accounts?.map((acc) => (
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
          <Button type="primary" htmlType="submit" disabled={createTransactionQuery.isLoading}>
            Добавить
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
