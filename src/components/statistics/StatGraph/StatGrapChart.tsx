import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { MonthlyStatCategory } from '../../../server/routes/statistics';
import { formatMoneyShort } from '../../../utils/format';

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const StatGraphChart: React.VFC<{ statCategories: MonthlyStatCategory[] }> = ({ statCategories }) => {
  const getChartItem = (statItem: MonthlyStatCategory) =>
    statItem.data.map((item) => ({ name: item.period, [statItem.category.name as string]: item.amount / 100 }));

  const chartDataFlatted = statCategories.map((statItem) => getChartItem(statItem)).flat();

  const chartDataMap = new Map();
  for (let i = 0; i < chartDataFlatted.length; i++) {
    const mapKey = chartDataFlatted[i].name;
    const mapItem = chartDataMap.get(mapKey);
    if (!mapItem) {
      chartDataMap.set(mapKey, chartDataFlatted[i]);
    } else {
      chartDataMap.set(mapKey, { ...mapItem, ...chartDataFlatted[i] });
    }
  }
  const chartDataValues = [...chartDataMap.values()];
  const chartDataKeys = statCategories.map((statItem) => statItem.category.name);

  return (
    <div style={{ height: 600, marginLeft: -30 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          height={600}
          data={chartDataValues}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => formatMoneyShort(value)} />
          <Tooltip />
          <Legend />
          {chartDataKeys.map((item) => (
            <Line key={item} type="monotone" dataKey={item} stroke={getRandomColor()} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
