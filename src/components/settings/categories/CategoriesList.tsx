import { useNavigate } from 'react-router-dom';
import { Loader } from '../../_shared/Loader';
import styled from 'styled-components';
import { UI_ROUTES } from '../../../constants/urls';
import { useCategories } from '../../../hooks/useCategories';
import { Button, Tree } from 'antd';
import { useState } from 'react';

const CategoriesListWrapper = styled.div`
  margin-bottom: 1em;
`;

const CategoryName = styled.span<{ active: boolean }>`
  color: ${({ theme, active }) => (active ? theme.text.primary : theme.text.inactive)};
`;

export const CategoriesList: React.VFC = () => {
  const navigate = useNavigate();
  const { useGetTree } = useCategories();
  const [showHidden, setShowHidden] = useState(false);
  const { isFetching, isError, data: categoriesTree } = useGetTree({ showHidden: showHidden });

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
      {!showHidden && (
        <Button
          onClick={() => {
            setShowHidden(true);
          }}
        >
          Показать скрытые
        </Button>
      )}
    </CategoriesListWrapper>
  );
};
