import React from 'react';
import { ResponsiveStream } from '@nivo/stream';

interface GenreTrendDatum {
  month: string;
  [genre: string]: string | number;
}

interface Props {
  data: GenreTrendDatum[];
  keys: string[];
}

/**
 * GenreTrendsStream renders a responsive stacked stream graph using @nivo/stream.
 * It assumes each `data` item has a `month` field and numeric values for each genre key.
 */
export const GenreTrendsStream: React.FC<Props> = ({ data, keys }) => {
  return (
    <div style={{ height: 300 }} className="w-full">
      <ResponsiveStream
        data={data}
        keys={keys}
        indexBy="month"
        margin={{ top: 20, right: 80, bottom: 40, left: 80 }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: 'Month',
          legendOffset: 36,
          legendPosition: 'middle',
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Share (%)',
          legendOffset: -40,
          legendPosition: 'middle',
        }}
        offsetType="wiggle"
        colors={{ scheme: 'nivo' }}
        fillOpacity={0.85}
        borderColor={{ theme: 'background' }}
        dotSize={8}
        dotColor={{ from: 'color', modifiers: [] }}
        dotBorderWidth={2}
        dotBorderColor={{ from: 'color', modifiers: [['darker', 0.7]] }}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 80,
            translateY: 0,
            itemsSpacing: 4,
            itemWidth: 60,
            itemHeight: 12,
            itemTextColor: '#999',
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 12,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000',
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default GenreTrendsStream;
