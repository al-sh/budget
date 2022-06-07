import { useNavigate } from 'react-router-dom';
import { Loader } from '../../_shared/Loader';
import styled from 'styled-components';
import { UI_ROUTES } from '../../../constants/urls';
import { useCategories } from '../../../hooks/useCategories';
import { Tree } from 'antd';

const CategoriesListWrapper = styled.div`
  margin-bottom: 1em;
`;

const CategoryName = styled.span<{ active: boolean }>`
  color: ${({ theme, active }) => (active ? theme.text.primary : theme.text.inactive)};
`;

export const CategoriesList: React.VFC = () => {
  const { useGetTree } = useCategories();
  const { isFetching, isError, data: categoriesTree } = useGetTree();
  const navigate = useNavigate();

  if (isFetching) return <Loader />;
  if (isError) return <>Error</>;

  return (
    <CategoriesListWrapper>
      <Tree
        treeData={categoriesTree}
        selectable={false}
        titleRender={(item) => (
          <span>
            <CategoryName
              active={item.isActive}
              onClick={() => {
                navigate(`${UI_ROUTES.SETTINGS.CATEGORIES}/${item.key}`);
              }}
            >
              {item.title}
            </CategoryName>
          </span>
        )}
      />
    </CategoriesListWrapper>
  );
};
