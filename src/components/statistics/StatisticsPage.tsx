import { Tabs } from 'antd';
import moment from 'moment';
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
import { StatGraph } from './StatGraph/StatGraph';

export const StatisticsPage: React.VFC = () => {
  const [showFilters, setShowFilters] = useState(false);

  const dateFrom = new Date();
  dateFrom.setMonth(dateFrom.getMonth() - 6);
  dateFrom.setDate(1);

  const dateEnd = new Date();
  dateEnd.setDate(0);

  const [filterParams, setFilterParams] = useState<GetStatTreeFormParams>({
    typeId: ETRANSACTION_TYPE.EXPENSE,
    showHidden: false,
    dateFrom: moment(dateFrom),
    dateEnd: moment(dateEnd),
  });
  const [selectedCategories, setSelectedCategories] = useState<Category['id'][] | undefined>(undefined);

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
        <StatCategoriesList categoriesTree={categoriesTree} onSelect={(selectedIds) => setSelectedCategories(selectedIds)} />
      )}
      {selectedCategories && <StatGraph filterParams={filterParams} selectedCategories={selectedCategories} />}
    </>
  );
};

export default StatisticsPage;
