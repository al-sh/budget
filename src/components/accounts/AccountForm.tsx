import { Form, Input, Checkbox, Button } from 'antd';
import { useAccounts } from '../../hooks/useAccounts';
import { Account } from '../../server/entity/Account';

export const AccountForm: React.VFC<{ account?: Account }> = ({ account }) => {
  console.log('AccountForm account', account);
  const { useItem } = useAccounts();
  const isUpdate = !!account;
  const query = useItem(isUpdate ? 'PUT' : 'POST', isUpdate ? account.id : undefined);

  return (
    <div style={{ width: 400 }}>
      {account ? <div>Редактирование счета {account?.name}</div> : <div>Новый счет</div>}

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
          isActive: account?.id ? account.isActive : true,
          name: account?.id ? account.name : '',
        }}
        onFinish={(formValues) => {
          query.mutate(formValues);
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
