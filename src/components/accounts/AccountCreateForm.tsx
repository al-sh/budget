import { Form, Input, Checkbox, Button } from 'antd';
import { useAccounts } from '../../hooks/useAccounts';

export const AccountCreateForm: React.VFC = () => {
  const { useCreate } = useAccounts();
  const createAccountQuery = useCreate();

  return (
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
        onFinish={(formValues) => {
          createAccountQuery.mutate(formValues);
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
          <Button type="primary" htmlType="submit" disabled={createAccountQuery.isLoading}>
            Добавить
          </Button>
        </Form.Item>
      </Form>
      {createAccountQuery.isLoading && <div>Добавление счета...</div>}
    </div>
  );
};
