import React from 'react';
import ReactECharts from 'echarts-for-react';

interface Props {
  score: number; // 0 - 100
}

/**
 * LibraryHealthGauge renders a semi-circular gauge using ECharts to display a single health score.
 */
export const LibraryHealthGauge: React.FC<Props> = ({ score }) => {
  const option = {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 5,
        progress: {
          show: true,
          width: 18,
          roundCap: true,
          itemStyle: {
            color: '#10b981', // Tailwind green-500 equivalent as default
          },
        },
        pointer: {
          show: true,
          length: '70%',
          width: 6,
        },
        axisLine: {
          lineStyle: {
            width: 18,
          },
        },
        axisTick: {
          distance: -22,
          splitNumber: 5,
          lineStyle: {
            width: 1,
            color: '#999',
          },
        },
        splitLine: {
          distance: -25,
          length: 14,
          lineStyle: {
            width: 2,
            color: '#999',
          },
        },
        axisLabel: {
          distance: -38,
          color: '#999',
          fontSize: 10,
        },
        detail: {
          valueAnimation: true,
          formatter: '{value} / 100',
          color: 'var(--tw-text-opacity)',
          fontSize: 20,
          offsetCenter: [0, '-15%'],
        },
        data: [
          {
            value: Math.round(score),
          },
        ],
      },
    ],
  } as const;

  return (
    <ReactECharts option={option} style={{ height: 220, width: '100%' }} className="w-full" />
  );
};

export default LibraryHealthGauge;
