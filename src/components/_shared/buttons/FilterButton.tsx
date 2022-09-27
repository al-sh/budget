import { Button } from 'antd';
import styled from 'styled-components';

const FilterButtonWrapper = styled(Button)``;

export const FilterButton: React.VFC<{ onClick: () => void; showFilters: boolean }> = ({ showFilters, onClick }) => (
  <FilterButtonWrapper onClick={onClick}>{showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}</FilterButtonWrapper>
);
