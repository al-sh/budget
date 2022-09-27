/* eslint-disable sort-exports/sort-exports */
import { Checkbox as AntdCheckbox, CheckboxProps as AntdCheckboxProps } from 'antd';
import 'moment/locale/ru';

export interface CheckboxProps {
  value?: boolean;
  onChange?: AntdCheckboxProps['onChange'];
}

export const Checkbox: React.VFC<CheckboxProps> = ({ onChange, value }) => <AntdCheckbox checked={value} onChange={onChange} />;
