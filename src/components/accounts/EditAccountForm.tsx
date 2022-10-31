import { Form, Input, Checkbox, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UI_ROUTES } from '../../constants/urls';
import { useAccounts } from '../../hooks/useAccounts';
import { AccountWithRest } from '../../server/types/accounts';
import { formatMoney } from '../../utils/format';
import { FormHeader } from '../_shared/forms/FormHeader';
import { AccountIconSelect } from './icons/AccountIconSelect';

export const EditAccountForm: React.VFC<{ account: AccountWithRest }> = ({ account }) => {
  const { useItem } = useAccounts();
  const navigate = useNavigate();
  const query = useItem('PUT', {
    id: account.id,
    onSuccess: () => {
      navigate(UI_ROUTES.SETTINGS.ACCOUNTS);
    },
  });
  const deleteAccountMutation = useItem('DELETE', {
    id: account.id,
    onSuccess: () => {
      navigate(UI_ROUTES.SETTINGS.ACCOUNTS);
    },
  });

  return (
    <div>
      <FormHeader
        text="Редактирование счета"
        onDeleteButtonClick={() => {
          if (confirm('Удалить счет?')) {
            deleteAccountMutation.mutate({ id: account.id });
          }
        }}
      />

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
          initialValue: account.initialValue / 100,
          isActive: account?.id ? account.isActive : true,
          name: account?.id ? account.name : '',
          icon: account.icon,
        }}
        onFinish={(formValues) => {
          query.mutate(formValues);
          navigate(UI_ROUTES.SETTINGS.ACCOUNTS);
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

        <Form.Item label="Иконка" name="icon">
          <AccountIconSelect />
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
