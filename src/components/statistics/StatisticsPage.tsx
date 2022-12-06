import { Tabs } from 'antd';
import React, { useState } from 'react';
import { GetStatTreeFormParams, useStatistics } from '../../hooks/useStatistics';
import { Category } from '../../server/entity/Category';
import { ETRANSACTION_TYPE } from '../../server/types/transactions';
import { FilterButton } from '../_shared/buttons/FilterButton';
import { Loader } from '../_shared/Loader';
import { HeaderBlock } from '../_shared/_base/HeaderBlock';
import { HeaderTitle } from '../_shared/_base/HeaderTitle';
import { StatCategoriesList } from './StatCategoriesList';
import { StatFilters } from './StatFilters';
import { StatGraph } from './StatGraph';

export const StatisticsPage: React.VFC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filterParams, setFilterParams] = useState<GetStatTreeFormParams>({ typeId: ETRANSACTION_TYPE.EXPENSE, showHidden: false });
  const [selectedCategory, setSelectedCategory] = useState<Category['id'] | undefined>(undefined);

  const { useGetTree } = useStatistics();

  const { isLoading, isError, data: categoriesTree } = useGetTree(filterParams);

  let filtersCount = 0;
  for (const key in filterParams) {
    if (key !== 'typeId' && filterParams[key as keyof GetStatTreeFormParams]) {
      filtersCount++;
    }
  }

  if (isError) return <>Error</>;

  return (
    <>
      <HeaderBlock>
        <HeaderTitle>Статистика по категориям</HeaderTitle>
        <FilterButton
          onClick={() => {
            setShowFilters(!showFilters);
          }}
          showFilters={showFilters}
          filtersCount={filtersCount}
        />
      </HeaderBlock>
      {showFilters && (
        <StatFilters
          params={filterParams}
          onClear={() => {
            setShowFilters(false);
            setFilterParams({ ...{} });
          }}
          onFinish={(params) => {
            setShowFilters(false);
            setFilterParams({ ...filterParams, ...params });
          }}
        />
      )}
      <Tabs
        activeKey={String(filterParams.typeId)}
        onChange={(activeKey) => {
          setFilterParams({ ...filterParams, typeId: parseInt(activeKey) });
        }}
      >
        <Tabs.TabPane tab="Расходы" key={String(ETRANSACTION_TYPE.EXPENSE)} />
        <Tabs.TabPane tab="Доходы" key={String(ETRANSACTION_TYPE.INCOME)} />
      </Tabs>
      {isLoading && <Loader />}
      {categoriesTree && !isLoading && (
        <StatCategoriesList categoriesTree={categoriesTree} onSelect={(selectedIds) => setSelectedCategory(selectedIds[0])} />
      )}
      <StatGraph filterParams={filterParams} selectedCategory={selectedCategory} />
    </>
  );
};

export default StatisticsPage;
