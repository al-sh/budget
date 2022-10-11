import { Button, Tabs } from 'antd';
import React, { useState } from 'react';
import { ETRANSACTION_TYPE } from '../../../../server/types/transactions';
import { CategoriesList } from '../CategoriesList';
import { CategoryNewForm } from '../CategoryNewForm';

export const CategoriesPage: React.VFC = () => {
  const [isAdd, setIsAdd] = useState(false);
  const [typeId, setTypeId] = useState(ETRANSACTION_TYPE.EXPENSE);
  const [showHidden, setShowHidden] = useState(false);

  return (
    <>
      <h2>Категории</h2>
      <Tabs
        defaultActiveKey={String(ETRANSACTION_TYPE.EXPENSE)}
        onChange={(activeKey) => {
          setTypeId(parseInt(activeKey));
        }}
      >
        <Tabs.TabPane tab="Расходы" key={String(ETRANSACTION_TYPE.EXPENSE)} />

        <Tabs.TabPane tab="Доходы" key={String(ETRANSACTION_TYPE.INCOME)} />
      </Tabs>
      <CategoriesList showHidden={showHidden} typeId={typeId} />
      {!showHidden && (
        <Button
          onClick={() => {
            setShowHidden(true);
          }}
        >
          Показать скрытые
        </Button>
      )}
      <Button
        onClick={() => {
          setIsAdd(true);
        }}
      >
        Добавить
      </Button>
      {isAdd && (
        <CategoryNewForm
          onFinish={() => {
            setIsAdd(false);
          }}
        />
      )}
    </>
  );
};

export default CategoriesPage;
