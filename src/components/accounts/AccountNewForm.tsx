import { Form, Input, Button, InputNumber } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAccounts } from '../../hooks/useAccounts';

export const AccountNewForm: React.VFC<{ onFinish: () => void }> = ({ onFinish }) => {
  const { useItem } = useAccounts();
  const query = useItem('POST');
  const navigate = useNavigate();

  return (
    <div style={{ width: 400 }}>
      <div>Новый счет</div>

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
          console.log('query.isSuccess');
          navigate('/accounts');
          onFinish();
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

        {
          <Form.Item label="Остаток" name="initialValue">
            <InputNumber
              style={{
                width: 300,
              }}
            />
          </Form.Item>
        }

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
