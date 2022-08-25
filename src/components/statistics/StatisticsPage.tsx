import { Button, Tabs } from 'antd';
import React, { useState } from 'react';
import { ETRANSACTION_TYPE } from '../../server/types/transactions';
import { StatCategoriesList } from './StatCategoriesList';

export const StatisticsPage: React.VFC = () => {
  const [typeId, setTypeId] = useState(ETRANSACTION_TYPE.EXPENSE);
  const [showHidden, setShowHidden] = useState(false);

  return (
    <>
      <h2>Статистика по категориям</h2>
      <Tabs
        defaultActiveKey={String(ETRANSACTION_TYPE.EXPENSE)}
        onChange={(activeKey) => {
          setTypeId(parseInt(activeKey));
        }}
      >
        <Tabs.TabPane tab="Расходы" key={String(ETRANSACTION_TYPE.EXPENSE)} />
        <Tabs.TabPane tab="Доходы" key={String(ETRANSACTION_TYPE.INCOME)} />
      </Tabs>
      <StatCategoriesList showHidden={showHidden} typeId={typeId} />
      {!showHidden && (
        <Button
          onClick={() => {
            setShowHidden(true);
          }}
        >
          Показать скрытые
        </Button>
      )}
    </>
  );
};

export default StatisticsPage;
