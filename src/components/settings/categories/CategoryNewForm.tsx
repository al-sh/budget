import { Form, Input, Button } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UI_ROUTES } from '../../../constants/urls';
import { useCategories } from '../../../hooks/useCategories';
import { ETRANSACTION_TYPE } from '../../../server/types/transactions';
import { CategoriesSelect } from '../../_shared/selects/CategoriesSelect';
import { TransactionTypeSelect } from '../../_shared/selects/TransactionTypeSelect';

export const CategoryNewForm: React.VFC<{ onFinish: () => void }> = ({ onFinish }) => {
  const { useCreate } = useCategories();
  const query = useCreate();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [typeId, setTypeId] = useState(ETRANSACTION_TYPE.EXPENSE);

  return (
    <div>
      <div>Новая категория</div>

      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        form={form}
        layout="vertical"
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          initialValue: 0,
          name: '',
          typeId: ETRANSACTION_TYPE.EXPENSE,
        }}
        onValuesChange={() => {
          setTypeId(form.getFieldValue(['type', 'id']));
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
          name={['type', 'id']}
          rules={[
            {
              message: 'Укажите тип категории',
              required: true,
            },
          ]}
        >
          <TransactionTypeSelect hideReturns />
        </Form.Item>

        <Form.Item label="Родительская категория" name={['parentCategory', 'id']}>
          <CategoriesSelect typeId={typeId} allowClear />
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
