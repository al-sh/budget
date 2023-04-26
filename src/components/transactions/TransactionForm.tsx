import { Button, Checkbox, Form, Input, InputNumber } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../../hooks/useTransactions';
import { ETRANSACTION_TYPE, LocalTransaction } from '../../server/types/transactions';
import { AccountsSelect } from '../_shared/selects/AccountsSelect';
import { CategoriesSelect } from '../_shared/selects/CategoriesSelect';
import { TransactionTypeSelect } from '../_shared/selects/TransactionTypeSelect';
import { DatePicker } from '../_shared/_base/DatePicker';

export const TransactionForm: React.VFC<{ transaction?: LocalTransaction }> = ({ transaction }) => {
  const [form] = Form.useForm();
  const [typeId, setTypeId] = useState(transaction?.typeId ? transaction.typeId : ETRANSACTION_TYPE.EXPENSE);

  const { useItem } = useTransactions();
  const updateQuery = useItem('PUT', { id: transaction?.id ?? '' });
  const addQuery = useItem('POST', { id: transaction?.id ?? '' });

  const navigate = useNavigate();

  const [isSubmitDisabled, setisSubmitDisabled] = useState(true);
  const [createMore, setCreateMore] = useState(false);

  return (
    <div>
      <Form
        name="transactionForm"
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
        preserve
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          accountId: transaction?.accountId || '',
          amount: (!!transaction?.amount && transaction?.amount / 100) || undefined,
          categoryId: transaction?.categoryId || '',
          description: transaction?.description || '',
          dt: moment(transaction?.dt) || new Date(),
          toAccountId: transaction?.toAccountId || '',
          typeId: transaction?.typeId || ETRANSACTION_TYPE.EXPENSE,
        }}
        onFinish={(formValues) => {
          transaction?.id ? updateQuery.mutate(formValues) : addQuery.mutate(formValues);
          form.setFieldsValue({ amount: undefined, description: '' });
          !createMore && navigate(-1);
        }}
        autoComplete="off"
      >
        <Form.Item label="Дата" name="dt" rules={[{ message: 'Укажите дату', required: true }]}>
          <DatePicker withTime />
        </Form.Item>

        <Form.Item label="Сумма" name="amount" rules={[{ message: 'Укажите сумму', required: true }]}>
          <InputNumber
            style={{
              width: '100%',
            }}
            formatter={(value) => `${value}`}
            parser={(value) => (value ? value.replace(',', '.') : '')}
          />
        </Form.Item>

        <Form.Item label="Счет" name="accountId" rules={[{ message: 'Выберите счет', required: true }]}>
          <AccountsSelect />
        </Form.Item>

        <Form.Item label="Тип" name="typeId" rules={[{ message: 'Выберите тип', required: true }]}>
          <TransactionTypeSelect />
        </Form.Item>

        {typeId === ETRANSACTION_TYPE.TRANSFER && (
          <Form.Item label="Счет пополнения" name="toAccountId" rules={[{ message: 'Выберите счет пополнения', required: true }]}>
            <AccountsSelect />
          </Form.Item>
        )}

        {typeId !== ETRANSACTION_TYPE.TRANSFER && (
          <Form.Item label="Категория" name="categoryId" rules={[{ message: 'Выберите категорию', required: true }]}>
            <CategoriesSelect typeId={typeId} />
          </Form.Item>
        )}

        <Form.Item label="Описание" name="description">
          <Input />
        </Form.Item>

        {!transaction && (
          <Checkbox
            onChange={(e) => {
              setCreateMore(e.target.checked);
            }}
          >
            Создать еще
          </Checkbox>
        )}

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit" disabled={isSubmitDisabled}>
            Сохранить
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
