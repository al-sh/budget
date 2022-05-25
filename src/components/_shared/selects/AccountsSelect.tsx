import { Select } from 'antd';
import { useAccounts } from '../../../hooks/useAccounts';

interface Props {
  onChange?: (newValue: number) => void;
  value?: number;
}

export const AccountsSelect: React.VFC<Props> = ({ value, onChange }) => {
  const { isLoading: isAccountsLoading, data: accounts } = useAccounts().useGetList();

  return (
    <Select loading={isAccountsLoading} value={value} onChange={onChange}>
      {accounts?.map((acc) => (
        <Select.Option key={acc.id} value={acc.id}>
          {acc.name}
        </Select.Option>
      ))}
    </Select>
  );
};
