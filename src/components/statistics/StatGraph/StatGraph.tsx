import { GetStatTreeFormParams, useStatistics } from '../../../hooks/useStatistics';
import { Category } from '../../../server/entity/Category';
import { Loader } from '../../_shared/Loader';

import { StatGraphChart } from './StatGrapChart';
import { StatGraphRawData } from './StatGraphRawData';

export const StatGraph: React.VFC<{ filterParams: GetStatTreeFormParams; selectedCategories: Category['id'][] }> = ({
  filterParams,
  selectedCategories,
}) => {
  const { useGraph } = useStatistics();
  const { isLoading, isError, data: statCategories } = useGraph({ ...filterParams, categoryIds: selectedCategories });

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
      <StatGraphChart statCategories={statCategories} />
      <StatGraphRawData statCategories={statCategories} />
    </div>
  );
};
