import { Select as AntdSelect } from 'antd';
import { ReactNode } from 'react';

interface Props {
  allowClear?: boolean;
  children?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  value?: number;
  onChange?: (newValue: number) => void;
}

export const Select: React.FC<Props> = ({ allowClear, children, disabled, loading, value, onChange }) => {
  return (
    <AntdSelect allowClear={allowClear} disabled={disabled} loading={loading} value={value != 0 ? value : undefined} onChange={onChange}>
      {children}
    </AntdSelect>
  );
};

export const SelectOption: React.FC<{ value?: string | number }> = ({ children }) => <AntdSelect.Option>{children}</AntdSelect.Option>;
