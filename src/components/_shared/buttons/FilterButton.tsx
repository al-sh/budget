import styled from 'styled-components';
import { ReactComponent as FilterButtonSVG } from './FilterButton.svg';

const FilterButtonWrapper = styled.div`
  cursor: pointer;
  position: relative;
`;

const Counter = styled.span`
  position: absolute;
  height: 16px;
  width: 16px;
  padding-left: 4px;
  bottom: 0px;
  right: -5px;
  border-radius: 8px;
  line-height: 18px;
  background-color: ${({ theme }) => theme.background.main};
  color: ${({ theme }) => theme.text.active};
`;

export const FilterButton: React.VFC<{ filtersCount?: number; onClick: () => void; showFilters: boolean }> = ({
  showFilters,
  onClick,
  filtersCount,
}) => (
  <FilterButtonWrapper>
    <FilterButtonSVG onClick={onClick}>{showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}</FilterButtonSVG>
    {!!filtersCount && <Counter>{filtersCount}</Counter>}
  </FilterButtonWrapper>
);
