import { useState } from 'react';
import { MonthlyStatCategory } from '../../../server/routes/statistics';
import { formatMoney } from '../../../utils/format';
import { Button } from '../../_shared/_base/Button';

export const StatGraphRawData: React.VFC<{ statCategories: MonthlyStatCategory[] }> = ({ statCategories }) => {
  const [showData, setShowData] = useState(false);
  return (
    <div>
      {!showData && (
        <Button
          onClick={() => {
            setShowData(true);
          }}
        >
          Показать данные
        </Button>
      )}
      <div>
        {showData &&
          statCategories?.length > 0 &&
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
    </div>
  );
};
