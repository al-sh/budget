import { TreeSelect } from 'antd';
import { useCategories } from '../../../hooks/useCategories';
import { ETRANSACTION_TYPE } from '../../../server/types/transactions';

interface Props {
  onChange?: (newValue: number) => void;
  typeId: ETRANSACTION_TYPE;
  value?: number;
  allowClear?: boolean;
}

export const CategoriesSelect: React.VFC<Props> = ({ typeId, onChange, value, allowClear }) => {
  const { isLoading, data: categoriesTree } = useCategories().useGetTree(typeId);

  return (
    <TreeSelect
      treeData={categoriesTree}
      allowClear={allowClear}
      loading={isLoading}
      disabled={!typeId}
      onChange={onChange}
      value={value}
      dropdownStyle={{
        overflow: 'auto',
      }}
      treeDefaultExpandAll
    />
  );
};
