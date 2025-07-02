import React from 'react';
import { Axis, Grid, XYChart, Tooltip, AnimatedPointSeries } from '@visx/xychart';

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
  const accessors = {
    xAccessor: (d: Datum) => d.x,
    yAccessor: (d: Datum) => d.y,
  };

  return (
    <XYChart height={320} xScale={{ type: 'linear' }} yScale={{ type: 'linear' }}>
      <Grid columns={false} numTicks={10} stroke="#e4e4e7" />
      <AnimatedPointSeries
        dataKey="Series 1"
        data={data}
        {...accessors}
        colorAccessor={(d) => d.color || '#3b82f6'}
        sizeAccessor={() => 6}
      />
      <Axis orientation="bottom" label={xLabel} tickFormat={(v) => `${v}`} />
      <Axis orientation="left" label={yLabel} />
      <Tooltip<Datum>
        renderTooltip={({ datum }) => (
          <div className="px-2 py-1 text-sm">
            <div className="font-medium">{datum.label}</div>
            <div>
              {xLabel}: {datum.x}
            </div>
            <div>
              {yLabel}: {datum.y}
            </div>
          </div>
        )}
      />
    </XYChart>
  );
};

export default FeatureScatter;
