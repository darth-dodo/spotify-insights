import React from 'react';
import {
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  Scatter,
  ResponsiveContainer,
} from 'recharts';

interface Datum {
  x: number;
  y: number;
  label: string;
  color?: string;
}

interface Props {
  data: Datum[];
  xLabel?: string;
  yLabel?: string;
}

/**
 * FeatureScatter renders an interactive scatter plot using @visx/xychart.
 */
export const FeatureScatter: React.FC<Props> = ({ data, xLabel = 'X', yLabel = 'Y' }) => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="x"
          name={xLabel}
          type="number"
          label={{ value: xLabel, position: 'insideBottom', offset: -5 }}
        />
        <YAxis
          dataKey="y"
          name={yLabel}
          type="number"
          label={{ value: yLabel, angle: -90, position: 'insideLeft' }}
        />
        <RTooltip
          cursor={{ strokeDasharray: '3 3' }}
          content={({ active, payload }) => {
            if (active && payload && payload[0]) {
              const d = payload[0].payload as Datum;
              return (
                <div className="bg-background border border-border rounded-lg p-2 text-xs">
                  <div className="font-medium mb-1">{d.label}</div>
                  <div>{xLabel}: {d.x}</div>
                  <div>{yLabel}: {d.y}</div>
                </div>
              );
            }
            return null;
          }}
        />
        <Scatter
          data={data}
          fill="hsl(var(--accent))"
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default FeatureScatter;
