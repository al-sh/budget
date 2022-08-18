import { TreeSelect } from 'antd';
import { useCategories } from '../../../hooks/useCategories';
import { ETRANSACTION_TYPE } from '../../../server/types/transactions';

interface Props {
  onChange?: (newValue: number) => void;
  typeId: ETRANSACTION_TYPE;
  value?: number;
  allowClear?: boolean;
  disabled?: boolean;
}

export const CategoriesSelect: React.VFC<Props> = ({ typeId, onChange, value, allowClear, disabled }) => {
  const { isLoading, data: categoriesTree } = useCategories().useGetTree({ typeId: typeId });

  return (
    <TreeSelect
      treeData={categoriesTree}
      allowClear={allowClear}
      loading={isLoading}
      disabled={disabled || !typeId}
      onChange={onChange}
      value={value != 0 ? value : undefined}
      dropdownStyle={{
        overflow: 'auto',
      }}
      treeDefaultExpandAll
    />
  );
};
