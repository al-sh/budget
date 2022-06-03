import { Select } from 'antd';
import { useCategories } from '../../../hooks/useCategories';
import { ETRANSACTION_TYPE } from '../../../server/types/transactions';

interface Props {
  onChange?: (newValue: number) => void;
  typeId: ETRANSACTION_TYPE;
  value?: number;
}

export const CategoriesSelect: React.VFC<Props> = ({ typeId, onChange, value }) => {
  const { isLoading, data: categories } = useCategories().useGetList(typeId);

  return (
    <Select allowClear loading={isLoading} disabled={!typeId} onChange={onChange} value={value}>
      {categories?.length &&
        categories?.map((cat) => (
          <Select.Option key={cat.id} value={cat.id}>
            {cat.name}
          </Select.Option>
        ))}
    </Select>
  );
};
