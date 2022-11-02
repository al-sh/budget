import { Button, Form } from 'antd';

import { useState } from 'react';
import { GetTransactionsQueryParams } from '../../hooks/useTransactions';
import { ETRANSACTION_TYPE } from '../../server/types/transactions';
import { AccountsSelect } from '../_shared/selects/AccountsSelect';
import { CategoriesSelect } from '../_shared/selects/CategoriesSelect';
import { TransactionTypeSelect } from '../_shared/selects/TransactionTypeSelect';
import { DatePicker } from '../_shared/_base/DatePicker';

export const TransactionsFilters: React.VFC<{
  onClear: () => void;
  onFinish: (params: GetTransactionsQueryParams) => void;
  params: GetTransactionsQueryParams;
}> = ({ params, onClear, onFinish }) => {
  const [form] = Form.useForm();

  const [typeId, setTypeId] = useState<ETRANSACTION_TYPE | undefined>(params.typeId ? params.typeId : undefined);

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
        initialValues={params}
        onFinish={(formValues) => {
          onFinish(formValues);
        }}
        autoComplete="off"
      >
        <Form.Item label="Начало периода" name="dateFrom">
          <DatePicker />
        </Form.Item>

        <Form.Item label="Окончание периода" name="dateEnd">
          <DatePicker />
        </Form.Item>

        <Form.Item label="Счет" name="accountId">
          <AccountsSelect allowClear />
        </Form.Item>

        <Form.Item label="Тип" name="typeId">
          <TransactionTypeSelect
            allowClear
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
              onClear();
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
