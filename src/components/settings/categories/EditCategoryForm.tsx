import { Form, Input, Checkbox, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UI_ROUTES } from '../../../constants/urls';
import { useCategories } from '../../../hooks/useCategories';
import { Category } from '../../../server/entity/Category';
import { FormHeader } from '../../_shared/forms/FormHeader';

export const EditCategoryForm: React.VFC<{ category: Category }> = ({ category }) => {
  const { useItem } = useCategories();
  const query = useItem('PUT', category.id);
  const deleteCategoryMutation = useItem('DELETE');
  const navigate = useNavigate();

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
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          isActive: category?.id ? category.isActive : true,
          name: category?.id ? category.name : '',
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
