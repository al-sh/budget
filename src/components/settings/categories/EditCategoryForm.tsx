import { Form, Input, Checkbox, Button } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UI_ROUTES } from '../../../constants/urls';
import { useCategories } from '../../../hooks/useCategories';
import { Category } from '../../../server/entity/Category';
import { ETRANSACTION_TYPE } from '../../../server/types/transactions';
import { FormHeader } from '../../_shared/forms/FormHeader';
import { CategoriesSelect } from '../../_shared/selects/CategoriesSelect';
import { TransactionTypeSelect } from '../../_shared/selects/TransactionTypeSelect';

export const EditCategoryForm: React.VFC<{ category: Category }> = ({ category }) => {
  const { useItem } = useCategories();
  const query = useItem('PUT', category.id);
  const deleteCategoryMutation = useItem('DELETE');
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const initialTypeId = category.type.id ? category.type.id : ETRANSACTION_TYPE.EXPENSE;
  const [typeId, setTypeId] = useState(initialTypeId);

  return (
    <div>
      <FormHeader
        text="Редактирование категории"
        onDeleteButtonClick={() => {
          if (confirm('Удалить категорию?')) {
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
          isActive: category?.id ? category.isActive : true,
          name: category?.id ? category.name : '',
          typeId: initialTypeId,
        }}
        onValuesChange={() => {
          setTypeId(form.getFieldValue('typeId'));
        }}
        onFinish={(formValues) => {
          query.mutate(formValues);
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
          name="typeId"
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
          <CategoriesSelect typeId={typeId} />
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
          <Button type="primary" htmlType="submit" disabled={query.isLoading}>
            Сохранить
          </Button>
        </Form.Item>
      </Form>
      {query.isLoading && <div>Сохранение данных...</div>}
    </div>
  );
};
