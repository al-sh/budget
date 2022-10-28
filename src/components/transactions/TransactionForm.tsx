import { Form, InputNumber, Input, Button, Checkbox } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UI_ROUTES } from '../../constants/urls';
import { Transaction } from '../../server/entity/Transaction';
import { ETRANSACTION_TYPE } from '../../server/types/transactions';
import { getTrasactionsService } from '../../services/Transactions';
import { AccountsSelect } from '../_shared/selects/AccountsSelect';
import { CategoriesSelect } from '../_shared/selects/CategoriesSelect';
import { TransactionTypeSelect } from '../_shared/selects/TransactionTypeSelect';
import { DatePicker } from '../_shared/_base/DatePicker';

export const TransactionForm: React.VFC<{ transaction?: Transaction }> = ({ transaction }) => {
  const [form] = Form.useForm();
  const [typeId, setTypeId] = useState(transaction?.category?.type?.id ? transaction.category?.type?.id : ETRANSACTION_TYPE.EXPENSE);

  const navigate = useNavigate();

  const [isSubmitDisabled, setisSubmitDisabled] = useState(true);
  const [createMore, setCreateMore] = useState(false);
  const transactionsService = getTrasactionsService();

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
          accountId: transaction?.account?.id || '',
          amount: (!!transaction?.amount && transaction?.amount / 100) || undefined,
          categoryId: transaction?.category?.id || '',
          description: transaction?.description || '',
          dt: moment(transaction?.dt) || new Date(),
          toAccountId: transaction?.toAccount?.id || '',
          typeId: transaction?.category?.type?.id || ETRANSACTION_TYPE.EXPENSE,
        }}
        onFinish={(formValues) => {
          transaction ? transactionsService.update({ ...formValues, id: transaction?.id }) : transactionsService.create(formValues);
          form.setFieldsValue({ amount: undefined, description: '' });
          !createMore && navigate(-1);
        }}
        autoComplete="off"
      >
        <Form.Item label="Сумма" name="amount" rules={[{ message: 'Укажите сумму', required: true }]}>
          <InputNumber
            style={{
              width: '100%',
            }}
          />
        </Form.Item>

        <Form.Item label="Дата" name="dt" rules={[{ message: 'Укажите дату', required: true }]}>
          <DatePicker withTime />
        </Form.Item>

        <Form.Item label="Описание" name="description">
          <Input />
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
