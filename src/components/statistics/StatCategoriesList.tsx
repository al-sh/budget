import { Tree } from 'antd';
import styled from 'styled-components';
import { useStatistics } from '../../hooks/useStatistics';
import { ETRANSACTION_TYPE } from '../../server/types/transactions';
import { formatMoney, formatPercent } from '../../utils/format';
import { Loader } from '../_shared/Loader';

const CategoriesListWrapper = styled.div`
  margin-bottom: 1em;

  .ant-tree .ant-tree-node-content-wrapper {
    cursor: default;
  }
`;

const StatTreeItem = styled.div``;

const CategoryName = styled.span<{ active: boolean }>`
  display: inline-block;
  width: 150px;
  color: ${({ theme, active }) => (active ? theme.text.primary : theme.text.inactive)};
`;

const Amount = styled.span`
  margin-left: 10px;
  color: green;
`;

export const StatCategoriesList: React.VFC<{ showHidden?: boolean; typeId: ETRANSACTION_TYPE }> = ({ showHidden, typeId }) => {
  const { useGetTree } = useStatistics();

  const { isLoading, isError, data: categoriesTree } = useGetTree({ showHidden: !!showHidden, typeId: typeId });

  if (isLoading) return <Loader />;
  if (isError) return <>Error</>;

  return (
    <>
      <CategoriesListWrapper>
        <Tree
          treeData={categoriesTree}
          selectable={false}
          titleRender={(item) => (
            <StatTreeItem>
              <CategoryName active={!!item.isActive}>{item.title}</CategoryName>
              <Amount>
                {formatMoney(item.amount)} RUB ({formatPercent(item.share)}%)
              </Amount>
            </StatTreeItem>
          )}
        />
      </CategoriesListWrapper>
    </>
  );
};
