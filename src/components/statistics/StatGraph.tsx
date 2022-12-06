import { GetStatTreeFormParams, useStatistics } from '../../hooks/useStatistics';
import { Category } from '../../server/entity/Category';
import { formatMoney } from '../../utils/format';
import { Loader } from '../_shared/Loader';

export const StatGraph: React.VFC<{ filterParams: GetStatTreeFormParams; selectedCategory?: Category['id'] }> = ({
  filterParams,
  selectedCategory,
}) => {
  const { useGraph } = useStatistics();
  const { isLoading, isError, data: statCategories } = useGraph({ ...filterParams, categoryId: selectedCategory });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>useGraph error</div>;
  }

  if (!statCategories) {
    return <></>;
  }

  return (
    <div>
      {statCategories?.length > 0 &&
        statCategories?.map((item) => (
          <div key={item.category.id}>
            <div>{item.category.name}</div>
            <div>
              {item.data.map((item) => (
                <div key={item.period}>
                  <span>{item.period}</span>
                  <span style={{ marginLeft: 20 }}>{formatMoney(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};
