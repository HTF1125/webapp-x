// components/PerformanceChart.tsx

import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { formatPercentage } from '@/lib/fmt';

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend);

interface PerformanceChartProps {
  strategyData: number[];
  benchmarkData: number[];
  dates: string[];
  timeRange: '1M' | '3M' | '6M' | '1Y' | 'ALL';
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  strategyData,
  benchmarkData,
  dates,
  timeRange,
}) => {
  const normalizeData = (data: number[]) => {
    const startValue = data[0];
    return data.map(value => ((value - startValue) / startValue) * 100);
  };

  const normalizedStrategyData = useMemo(() =>
    timeRange !== 'ALL' ? normalizeData(strategyData) : strategyData,
    [strategyData, timeRange]
  );

  const normalizedBenchmarkData = useMemo(() =>
    timeRange !== 'ALL' ? normalizeData(benchmarkData) : benchmarkData,
    [benchmarkData, timeRange]
  );

  const chartData = useMemo(() => ({
    labels: dates,
    datasets: [
      {
        label: 'Strategy Value',
        data: normalizedStrategyData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
        pointRadius: 0
      },
      {
        label: 'Benchmark',
        data: normalizedBenchmarkData,
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.1)',
        fill: true,
        pointRadius: 0
      }
    ],
  }), [dates, normalizedStrategyData, normalizedBenchmarkData]);

  const options: ChartOptions<'line'> = useMemo(() => ({
    responsive: true,
    animation: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Strategy vs Benchmark Performance',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += timeRange !== 'ALL'
                ? formatPercentage(context.parsed.y / 100)
                : context.parsed.y.toFixed(2);
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'MMM d, yyyy',
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: timeRange !== 'ALL' ? 'Percentage Change' : 'Value',
        },
        ticks: {
          callback: function(value: number | string) {
            if (typeof value === 'number') {
              return timeRange !== 'ALL'
                ? formatPercentage(value / 100)
                : value.toFixed(2);
            }
            return value;
          }
        }
      },
    },
    elements: {
      point: {
        radius: 0
      },
      line: {
        tension: 0
      }
    }
  }), [timeRange]);

  return <Line data={chartData} options={options} />;
};

export default PerformanceChart;
