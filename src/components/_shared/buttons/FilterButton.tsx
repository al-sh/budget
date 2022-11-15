import styled from 'styled-components';
import { ReactComponent as FilterButtonSVG } from './FilterButton.svg';

const FilterButtonWrapper = styled.div`
  cursor: pointer;
`;

export const FilterButton: React.VFC<{ onClick: () => void; showFilters: boolean }> = ({ showFilters, onClick }) => (
  <FilterButtonWrapper>
    <FilterButtonSVG onClick={onClick}>{showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}</FilterButtonSVG>
  </FilterButtonWrapper>
);
