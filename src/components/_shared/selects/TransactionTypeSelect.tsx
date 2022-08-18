import { useTransactionTypes } from '../../../hooks/useTransactionTypes';
import { Select, SelectOption } from '../_base/Select';

interface Props {
  allowClear?: boolean;
  onChange?: (newValue: number) => void;
  value?: number;
  hideReturns?: boolean;
  disabled?: boolean;
}

export const TransactionTypeSelect: React.VFC<Props> = ({ allowClear, value, hideReturns, disabled, onChange }) => {
  const { isLoading: isTranTypesLoading, data: tranTypes } = useTransactionTypes(hideReturns);
  return (
    <Select allowClear={allowClear} loading={isTranTypesLoading} onChange={onChange} value={value} disabled={disabled}>
      {tranTypes?.length &&
        tranTypes?.map((tran) => (
          <SelectOption key={tran.id} value={tran.id}>
            {tran.name}
          </SelectOption>
        ))}
    </Select>
  );
};
