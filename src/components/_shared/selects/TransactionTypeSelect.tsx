import { Select } from 'antd';
import { useTransactionTypes } from '../../../hooks/useTransactionTypes';

interface Props {
  onChange?: (newValue: number) => void;
  value?: number;
  hideReturns?: boolean;
}

export const TransactionTypeSelect: React.VFC<Props> = ({ onChange, value, hideReturns }) => {
  const { isLoading: isTranTypesLoading, data: tranTypes } = useTransactionTypes(hideReturns);
  return (
    <Select loading={isTranTypesLoading} onChange={onChange} value={value}>
      {tranTypes?.length &&
        tranTypes?.map((tran) => (
          <Select.Option key={tran.id} value={tran.id}>
            {tran.name}
          </Select.Option>
        ))}
    </Select>
  );
};
