import { EditOutlined } from '@ant-design/icons';
import { Tree } from 'antd';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { UI_ROUTES } from '../../../constants/urls';
import { useCategories } from '../../../hooks/useCategories';
import { ETRANSACTION_TYPE } from '../../../server/types/transactions';
import { Loader } from '../../_shared/Loader';

const CategoriesListWrapper = styled.div`
  margin-bottom: 1em;

  .ant-tree .ant-tree-node-content-wrapper {
    cursor: default;
  }
`;

const CategoryName = styled.span<{ active: boolean }>`
  color: ${({ theme, active }) => (active ? theme.text.primary : theme.text.inactive)};
`;

const EditIcon = styled(EditOutlined)`
  margin-left: 0.5em;
  cursor: pointer;
`;

export const CategoriesList: React.VFC<{ showHidden?: boolean; typeId: ETRANSACTION_TYPE }> = ({ showHidden, typeId }) => {
  const navigate = useNavigate();
  const { useGetTree } = useCategories();

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
            <span>
              <CategoryName active={!!item.isActive}>
                {item.title}
                <EditIcon
                  onClick={() => {
                    navigate(`${UI_ROUTES.SETTINGS.CATEGORIES}/${item.key}`);
                  }}
                />
              </CategoryName>
            </span>
          )}
        />
      </CategoriesListWrapper>
    </>
  );
};
