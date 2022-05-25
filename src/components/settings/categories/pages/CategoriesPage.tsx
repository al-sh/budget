import { Button } from 'antd';
import React, { useState } from 'react';
import { CategoryNewForm } from '../CategoryNewForm';
import { CategoriesList } from '../CategoriesList';
export const CategoriesPage: React.VFC = () => {
  const [isAdd, setIsAdd] = useState(false);

  return (
    <>
      <h2>Категории</h2>
      <CategoriesList />
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
