import { Select } from 'antd';
import React from 'react';
import { icons } from './icons';

interface Props {
  onChange?: (newValue: number) => void;
  value?: number;
}

export const AccountIconSelect: React.VFC<Props> = ({ value, onChange }) => {
  return (
    <Select value={value} onChange={onChange}>
      {icons.map((item) => (
        <Select.Option key={item.value} value={item.value}>
          {item.el}
        </Select.Option>
      ))}
    </Select>
  );
};
