import { Button, Checkbox, Form, Input } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UI_ROUTES } from '../../../constants/urls';
import { useCategories } from '../../../hooks/useCategories';
import { LocalCategory } from '../../../server/types/categories';
import { FormHeader } from '../../_shared/forms/FormHeader';
import { CategoriesSelect } from '../../_shared/selects/CategoriesSelect';
import { TransactionTypeSelect } from '../../_shared/selects/TransactionTypeSelect';

export const EditCategoryForm: React.VFC<{ category: LocalCategory }> = ({ category }) => {
  const { useItem } = useCategories();
  const updateQuery = useItem('PUT', category.id);
  const deleteCategoryMutation = useItem('DELETE', category.id);
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const initialTypeId = category.typeId;
  const [typeId, setTypeId] = useState(initialTypeId);

  return (
    <div>
      <FormHeader
        text="Редактирование категории"
        onDeleteButtonClick={() => {
          if (confirm('Удалить категорию? При наличии транзакций категория будет скрыта.')) {
            deleteCategoryMutation.mutate({ id: category.id });
            navigate(UI_ROUTES.SETTINGS.CATEGORIES);
          }
        }}
      />

      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        layout="vertical"
        form={form}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          ...category,
          isActive: category?.id ? category.isActive : true,
          typeId: initialTypeId,
        }}
        onValuesChange={() => {
          setTypeId(form.getFieldValue('typeId'));
        }}
        onFinish={(formValues) => {
          updateQuery.mutate(formValues);
          navigate(UI_ROUTES.SETTINGS.CATEGORIES);
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
          name={'typeId'}
          rules={[
            {
              message: 'Укажите тип категории',
              required: true,
            },
          ]}
        >
          <TransactionTypeSelect hideReturns disabled />
        </Form.Item>

        <Form.Item label="Родительская категория" name={'parentCategoryId'}>
          <CategoriesSelect typeId={typeId} allowClear />
        </Form.Item>

        <Form.Item label="Порядок" name="order">
          <Input type="number" />
        </Form.Item>

        <Form.Item name="isActive" valuePropName="checked">
          <Checkbox>Активна</Checkbox>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit" disabled={updateQuery.isLoading}>
            Сохранить
          </Button>
        </Form.Item>
      </Form>
      {updateQuery.isLoading && <div>Сохранение данных...</div>}
    </div>
  );
};
