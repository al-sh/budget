import { Button, Form } from 'antd';
import { useState } from 'react';
import { GetStatTreeFormParams } from '../../hooks/useStatistics';
import { AccountsSelect } from '../_shared/selects/AccountsSelect';
import { Checkbox } from '../_shared/_base/Checkbox';
import { DatePicker } from '../_shared/_base/DatePicker';

export const StatFilters: React.VFC<{
  onClear: () => void;
  onFinish: (params: GetStatTreeFormParams) => void;
  params: GetStatTreeFormParams;
}> = ({ params, onClear, onFinish }) => {
  const [form] = Form.useForm();

  const [isSubmitDisabled, setisSubmitDisabled] = useState(false);

  return (
    <div>
      <Form
        name="StatFilters"
        form={form}
        labelCol={{
          span: 8,
        }}
        onValuesChange={() => {
          setisSubmitDisabled(form.getFieldsError().filter(({ errors }) => errors.length).length > 0);
        }}
        layout="horizontal"
        labelAlign="left"
        wrapperCol={{
          span: 16,
        }}
        initialValues={params}
        onFinish={(formValues) => {
          console.log('filter transactions values:', formValues);
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

        <Form.Item label="Показать скрытые" name="showHidden">
          <Checkbox
            onChange={(e) => {
              form.setFieldsValue({ showHidden: e.target.checked });
            }}
          />
        </Form.Item>

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
