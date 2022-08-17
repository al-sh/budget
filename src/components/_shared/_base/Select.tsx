import { Select as AntdSelect } from 'antd';
import { ReactNode } from 'react';

interface Props {
  allowClear?: boolean;
  children?: ReactNode;
  loading?: boolean;
  value?: number;
  onChange?: (newValue: number) => void;
}

export const Select: React.FC<Props> = ({ allowClear, children, loading, value, onChange }) => {
  return (
    <AntdSelect allowClear={allowClear} loading={loading} value={value} onChange={onChange}>
      {children}
    </AntdSelect>
  );
};

export const SelectOption: React.FC<{ value?: string | number }> = ({ children }) => <AntdSelect.Option>{children}</AntdSelect.Option>;
