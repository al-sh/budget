import { Form, Input, Checkbox, Button } from 'antd';
import { useAccounts } from '../../hooks/useAccounts';

export const AccountCreateForm: React.VFC = () => {
  const { useCreate } = useAccounts();
  const createAccountMutation = useCreate();

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
          createAccountMutation.mutate(formValues);
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
          <Button type="primary" htmlType="submit">
            Добавить
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
