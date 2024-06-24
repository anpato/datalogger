import { FC } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip as ChartTip
} from 'recharts';

const Chart: FC<{
  chartData: { [key: string]: number | string }[];
  selectedKeys: string[];
  strokeSize: number;
  selectedColors: { [key: string]: string };
}> = ({ chartData, selectedKeys, strokeSize, selectedColors }) => {
  return (
    <div className="w-full">
      <ResponsiveContainer className="h-full py-2" width={'100%'} height={900}>
        <LineChart data={chartData}>
          {!selectedKeys.length ? <h3>Select options from the right</h3> : null}
          <ChartTip />
          {selectedKeys.map((key) => {
            const color =
              selectedColors && selectedColors[key]
                ? { stroke: selectedColors[key] }
                : {};
            return (
              <Line
                strokeWidth={strokeSize}
                type="monotone"
                dataKey={key}
                key={key}
                dot={false}
                {...color}
              />
            );
          })}
          <YAxis
            type="number"
            tick={false}
            scale="auto"
            domain={['auto', 'auto']}
          />
          <XAxis tick={false} label={''} dataKey={'Time (msec)'} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
