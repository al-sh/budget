import { Button, Tabs } from 'antd';
import React, { useState } from 'react';
import { CategoryNewForm } from '../CategoryNewForm';
import { CategoriesList } from '../CategoriesList';
import { ETRANSACTION_TYPE } from '../../../../server/types/transactions';
import { API_ENDPOINTS } from '../../../../constants/api-endpoints';
import { getApi } from '../../../../services/Api';

const downloadToFile = (content: string, filename: string, contentType: string) => {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });

  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();

  URL.revokeObjectURL(a.href);
};

export const CategoriesPage: React.VFC = () => {
  const [isAdd, setIsAdd] = useState(false);
  const [typeId, setTypeId] = useState(ETRANSACTION_TYPE.EXPENSE);
  const [showHidden, setShowHidden] = useState(false);
  const api = getApi();

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
      <Button
        onClick={async () => {
          const res = await api.send({
            endpoint: API_ENDPOINTS.CATEGORIES.EXPORT,
            method: 'GET',
          });
          downloadToFile(JSON.stringify(res as string), 'categories.json', 'text/plain');
        }}
      >
        Выгрузить
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
