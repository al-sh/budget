import { Form, Input, Checkbox, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAccounts } from '../../hooks/useAccounts';
import { Account } from '../../server/entity/Account';

export const EditAccountForm: React.VFC<{ account: Account }> = ({ account }) => {
  const { useItem } = useAccounts();
  const query = useItem('PUT', account.id);
  const navigate = useNavigate();

  return (
    <div style={{ width: 400 }}>
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
          initialValue: 0,
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

        <Form.Item name="isActive" valuePropName="checked">
          <Checkbox>Активен</Checkbox>
        </Form.Item>

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
