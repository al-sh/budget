import { Form, InputNumber, Input, Select, Button } from 'antd';
import { useState } from 'react';
import { useAccounts } from '../../hooks/useAccounts';
import { useCategories } from '../../hooks/useCategories';
import { useTransactions } from '../../hooks/useTransactions';
import { useTransactionTypes } from '../../hooks/useTransactionTypes';
import { ETRANSACTION_TYPE } from '../../server/entity/TransactionType';

export const TransactionForm: React.VFC = () => {
  const [form] = Form.useForm();
  const { isLoading: isAccountsLoading, data: accounts } = useAccounts().useGetList();
  const [typeId, setTypeId] = useState(ETRANSACTION_TYPE.EXPENSE);
  const { isLoading: isCategoriesLoading, data: categories } = useCategories().useGetList(typeId);
  const { isLoading: isTranTypesLoading, data: tranTypes } = useTransactionTypes();
  const createTransactionQuery = useTransactions().useCreate();

  const [isSubmitDisabled, setisSubmitDisabled] = useState(true);

  return (
    <div style={{ width: 400 }}>
      <Form
        name="transactionForm"
        form={form}
        labelCol={{
          span: 8,
        }}
        onValuesChange={() => {
          setTypeId(form.getFieldValue('typeId'));
          setisSubmitDisabled(
            createTransactionQuery.isLoading ||
              !form.isFieldsTouched(true) ||
              form.getFieldsError().filter(({ errors }) => errors.length).length > 0
          );
        }}
        layout="horizontal"
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          isActive: true,
          name: '',
          typeId: ETRANSACTION_TYPE.EXPENSE,
        }}
        onFinish={(formValues) => createTransactionQuery.mutate(formValues)}
        autoComplete="off"
      >
        <Form.Item label="Сумма" name="amount" rules={[{ message: 'Укажите сумму', required: true }]}>
          <InputNumber
            style={{
              width: 300,
            }}
          />
        </Form.Item>

        <Form.Item label="Описание" name="description">
          <Input />
        </Form.Item>

        <Form.Item label="Счет" name="accountId" rules={[{ message: 'Выберите счет', required: true }]}>
          <Select loading={isAccountsLoading}>
            {accounts?.map((acc) => (
              <Select.Option key={acc.id} value={acc.id}>
                {acc.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Тип" name="typeId" rules={[{ message: 'Выберите тип', required: true }]}>
          <Select loading={isTranTypesLoading}>
            {tranTypes?.map((tran) => (
              <Select.Option key={tran.id} value={tran.id}>
                {tran.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Категория" name="categoryId" rules={[{ message: 'Выберите категорию', required: true }]}>
          <Select loading={isCategoriesLoading} disabled={!typeId}>
            {categories?.map((cat) => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit" disabled={isSubmitDisabled}>
            Добавить
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
