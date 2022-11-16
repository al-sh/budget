import { Form } from 'antd';

import { useState } from 'react';
import { GetTransactionsQueryParams } from '../../hooks/useTransactions';
import { ETRANSACTION_TYPE } from '../../server/types/transactions';
import { AccountsSelect } from '../_shared/selects/AccountsSelect';
import { CategoriesSelect } from '../_shared/selects/CategoriesSelect';
import { TransactionTypeSelect } from '../_shared/selects/TransactionTypeSelect';
import { Button } from '../_shared/_base/Button';
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
        onValuesChange={() => {
          setTypeId(form.getFieldValue('typeId'));
          setisSubmitDisabled(form.getFieldsError().filter(({ errors }) => errors.length).length > 0);
        }}
        layout="horizontal"
        labelAlign="left"
        initialValues={params}
        onFinish={(formValues) => {
          onFinish(formValues);
        }}
        autoComplete="off"
      >
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'baseline' }}>
          <Form.Item name="dateFrom" style={{ display: 'inline-block' }}>
            <DatePicker placeholder="Начало периода" />
          </Form.Item>
          <span style={{ margin: '0 12px 0 12px' }}>-</span>
          <Form.Item name="dateEnd" style={{ display: 'inline-block' }}>
            <DatePicker placeholder="Конец периода" />
          </Form.Item>
        </div>

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
          <div>
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
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};
