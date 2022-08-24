/* eslint-disable sort-exports/sort-exports */
import { DatePicker as AntdDatePicker, DatePickerProps as AntdDatePickerProps } from 'antd';
import { Moment } from 'moment';
import 'moment/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU'; //если потребуется где-то еще - перейти на ConfigProvider из Antd
import { formats } from '../../../constants/formats';

export interface DatePickerProps {
  withTime?: boolean;
  value?: Moment;
  onChange?: AntdDatePickerProps['onChange'];
}

export const DatePicker: React.VFC<DatePickerProps> = ({ withTime, onChange, value }) => (
  <AntdDatePicker
    format={withTime ? formats.dateMoment.withTime : formats.dateMoment.short}
    locale={locale}
    showTime={withTime}
    placeholder="Выберите дату"
    value={value}
    onChange={onChange}
  />
);
