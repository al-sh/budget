import { Button, DatePicker, Form } from 'antd';
import { useState } from 'react';
import { ETRANSACTION_TYPE } from '../../server/types/transactions';
import { AccountsSelect } from '../_shared/selects/AccountsSelect';
import { CategoriesSelect } from '../_shared/selects/CategoriesSelect';
import { TransactionTypeSelect } from '../_shared/selects/TransactionTypeSelect';

export const TransactionsFilters: React.VFC<{
  accountId?: number;
  categoryId?: number;
  onFinish?: (accId?: number, typeId?: number, catId?: number) => void;
  typeId?: number;
}> = ({ accountId, categoryId, onFinish, typeId: initialTypeId }) => {
  const [form] = Form.useForm();

  const [typeId, setTypeId] = useState(initialTypeId ? initialTypeId : ETRANSACTION_TYPE.EXPENSE);

  const [isSubmitDisabled, setisSubmitDisabled] = useState(false);

  return (
    <div>
      <Form
        name="TransactionsFilters"
        form={form}
        labelCol={{
          span: 8,
        }}
        onValuesChange={() => {
          setTypeId(form.getFieldValue('typeId'));
          setisSubmitDisabled(form.getFieldsError().filter(({ errors }) => errors.length).length > 0);
        }}
        layout="horizontal"
        labelAlign="left"
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          accountId: accountId,
          categoryId: categoryId,
          typeId: initialTypeId,
        }}
        onFinish={(formValues) => {
          console.log('filter transactions values:', formValues);
          onFinish && onFinish(formValues?.accountId, formValues?.typeId, formValues?.categoryId);
        }}
        autoComplete="off"
      >
        <Form.Item label="Дата" name="dt">
          <DatePicker format="YYYY-MM-DD HH:mm" showTime placeholder="Выберите дату" />
        </Form.Item>

        <Form.Item label="Счет" name="accountId">
          <AccountsSelect allowClear />
        </Form.Item>

        <Form.Item label="Тип" name="typeId">
          <TransactionTypeSelect
            onChange={() => {
              form.setFieldsValue({ categoryId: undefined });
            }}
          />
        </Form.Item>

        {typeId !== ETRANSACTION_TYPE.TRANSFER && (
          <Form.Item label="Категория" name="categoryId">
            <CategoriesSelect typeId={typeId} />
          </Form.Item>
        )}

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button
            type="link"
            onClick={() => {
              form.setFieldsValue({ accountId: 0, categoryId: undefined, typeId: 0 });
            }}
          >
            Очистить
          </Button>
          <Button type="primary" htmlType="submit" disabled={isSubmitDisabled}>
            Применить
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
