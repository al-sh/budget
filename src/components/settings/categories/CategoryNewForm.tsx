import { Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UI_ROUTES } from '../../../constants/urls';
import { useCategories } from '../../../hooks/useCategories';
import { TransactionTypeSelect } from '../../_shared/selects/TransactionTypeSelect';

export const CategoryNewForm: React.VFC<{ onFinish: () => void }> = ({ onFinish }) => {
  const { useCreate } = useCategories();
  const query = useCreate();
  const navigate = useNavigate();

  return (
    <div>
      <div>Новая категория</div>

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
          name: '',
        }}
        onFinish={(formValues) => {
          query.mutate(formValues);
          console.log('query.isSuccess', formValues);
          navigate(UI_ROUTES.SETTINGS.CATEGORIES);
          onFinish();
        }}
        autoComplete="off"
      >
        <Form.Item
          label="Название"
          name="name"
          rules={[
            {
              message: 'Введите название категории',
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Тип"
          name="typeId"
          rules={[
            {
              message: 'Укажите тип категории',
              required: true,
            },
          ]}
        >
          <TransactionTypeSelect />
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
