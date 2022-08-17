import { useAccounts } from '../../../hooks/useAccounts';
import { Select, SelectOption } from '../_base/Select';

interface Props {
  allowClear?: boolean;
  value?: number;
  onChange?: (newValue: number) => void;
}

export const AccountsSelect: React.VFC<Props> = ({ allowClear, value, onChange }) => {
  const { isLoading: isAccountsLoading, data: accounts } = useAccounts().useGetAccountsList(false);

  return (
    <Select loading={isAccountsLoading} allowClear={allowClear} value={value} onChange={onChange}>
      {accounts?.map((acc) => (
        <SelectOption key={acc.id} value={acc.id}>
          {acc.name}
        </SelectOption>
      ))}
    </Select>
  );
};
