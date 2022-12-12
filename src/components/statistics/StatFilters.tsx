import { Form } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { GetStatTreeFormParams } from '../../hooks/useStatistics';
import { AccountsSelect } from '../_shared/selects/AccountsSelect';
import { Button } from '../_shared/_base/Button';
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
        onValuesChange={() => {
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
          <Button
            onClick={() => {
              form.setFieldsValue({ dateFrom: moment('20220101'), dateEnd: moment('20221130') });
            }}
          >
            Год
          </Button>
          <Button
            onClick={() => {
              form.setFieldsValue({ dateFrom: moment('20220701'), dateEnd: moment('20221130') });
            }}
          >
            Полугодие
          </Button>
        </div>

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
