import { Select } from 'antd';
import { useTransactionTypes } from '../../../hooks/useTransactionTypes';

interface Props {
  onChange?: (newValue: number) => void;
  value?: number;
}

export const TransactionTypeSelect: React.VFC<Props> = ({ onChange, value }) => {
  const { isLoading: isTranTypesLoading, data: tranTypes } = useTransactionTypes();
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
