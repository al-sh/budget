import { Form, Input, Checkbox, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAccounts } from '../../hooks/useAccounts';
import { AccountWithRest } from '../../server/types/accounts';
import { formatMoney } from '../../utils/format';

export const EditAccountForm: React.VFC<{ account: AccountWithRest }> = ({ account }) => {
  const { useItem } = useAccounts();
  const query = useItem('PUT', account.id);
  const navigate = useNavigate();

  return (
    <div>
      <div>Редактирование счета</div>

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
          initialValue: account.initialValue,
          isActive: account?.id ? account.isActive : true,
          name: account?.id ? account.name : '',
        }}
        onFinish={(formValues) => {
          query.mutate(formValues);
          navigate('/accounts');
        }}
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

        <Form.Item
          label="Начальный остаток"
          name="initialValue"
          rules={[
            {
              message: 'Укажите начальный остаток',
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="isActive" valuePropName="checked">
          <Checkbox>Активен</Checkbox>
        </Form.Item>

        <span style={{ marginLeft: 10 }}>Остаток: {formatMoney(account.rest)}</span>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit" disabled={query.isLoading}>
            Сохранить
          </Button>
        </Form.Item>
      </Form>
      {query.isLoading && <div>Сохранение данных...</div>}
    </div>
  );
};
