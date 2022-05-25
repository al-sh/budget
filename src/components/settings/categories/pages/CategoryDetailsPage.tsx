import React from 'react';
import { useParams } from 'react-router-dom';
import { useCategories } from '../../../../hooks/useCategories';
import { Loader } from '../../../_shared/Loader';
import { EditCategoryForm } from '../EditCategoryForm';

export const CategoryDetailsPage: React.VFC = () => {
  const { categoryId } = useParams();
  const { useGetOne } = useCategories();
  const { isFetching, isError, data: category } = useGetOne(parseInt(categoryId));

  return (
    <>
      {isFetching && <Loader />}
      {isError && <div>Ошибка загрузки категории</div>}
      {!isFetching && !isError && <EditCategoryForm category={category} />}
    </>
  );
};

export default CategoryDetailsPage;
