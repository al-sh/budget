import { useNavigate } from 'react-router-dom';
import { Loader } from '../../_shared/Loader';
import styled from 'styled-components';
import { UI_ROUTES } from '../../../constants/urls';
import { useCategories } from '../../../hooks/useCategories';

const CategoriesListWrapper = styled.div`
  margin-bottom: 1em;
`;

const CategoryName = styled.span<{ active: boolean }>`
  color: ${({ theme, active }) => (active ? theme.text.primary : theme.text.inactive)};
`;

const CategoryType = styled.span``;

const CategoryWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid black;
  font-size: 1.5em;
`;

export const CategoriesList: React.VFC = () => {
  const { useGetList } = useCategories();
  const { isFetching, isError, data: categories } = useGetList();
  const navigate = useNavigate();

  if (isFetching) return <Loader />;
  if (isError) return <>Error</>;

  return (
    <CategoriesListWrapper>
      {categories.length &&
        categories.map((cat) => (
          <CategoryWrapper
            key={cat.id}
            onClick={() => {
              navigate(`${UI_ROUTES.SETTINGS.CATEGORIES}/${cat.id}`);
            }}
          >
            <CategoryName active={cat.isActive}>img {cat.name}</CategoryName>
            {cat.parentCategory && `(${cat.parentCategory.name}`}
            <CategoryType>{cat.type?.name}</CategoryType>
          </CategoryWrapper>
        ))}
    </CategoriesListWrapper>
  );
};
