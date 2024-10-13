import React, { useState } from 'react';
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
import { StrategyPerformance } from './types';
import { formatPercentage, formatDate } from '@/lib/fmt';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StrategyDetailsProps {
  performanceData: StrategyPerformance;
}

export default function StrategyDetails({ performanceData }: StrategyDetailsProps) {
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('ALL');

  const filterDataByTimeRange = (data: number[], dates: string[]) => {
    const now = new Date();
    let startDate: Date;
    switch (timeRange) {
      case '1M':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case '3M':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case '6M':
        startDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case '1Y':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        return { filteredData: data, filteredDates: dates };
    }

    const filteredIndices = dates.reduce((acc, date, index) => {
      if (new Date(date) >= startDate) acc.push(index);
      return acc;
    }, [] as number[]);

    return {
      filteredData: filteredIndices.map(i => data[i]),
      filteredDates: filteredIndices.map(i => dates[i]),
    };
  };

  const { filteredData: strategyData, filteredDates } = filterDataByTimeRange(performanceData.v, performanceData.d);
  const { filteredData: benchmarkData } = filterDataByTimeRange(performanceData.b, performanceData.d);

  const skipFactor = Math.ceil(filteredDates.length / Math.min(filteredDates.length / 2, 12));

  const chartData = {
    labels: filteredDates.filter((_, index) => index % skipFactor === 0),
    datasets: [
      {
        label: 'Strategy Value',
        data: strategyData.filter((_, index) => index % skipFactor === 0),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
        borderWidth: 1.5,
        pointRadius: 0,
      },
      {
        label: 'Benchmark',
        data: benchmarkData.filter((_, index) => index % skipFactor === 0),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        fill: true,
        borderWidth: 1.5,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
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
          title: (context) => formatDate(context[0].label),
        }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value',
        },
        beginAtZero: false,
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  const calculatePerformance = (data: number[]) => {
    const start = data[0];
    const end = data[data.length - 1];
    return (end - start) / start;
  };

  const strategyPerformance = calculatePerformance(strategyData);
  const benchmarkPerformance = calculatePerformance(benchmarkData);

  return (
    <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Performance Analysis</h3>
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Time Range:</p>
          <div className="mt-1">
            {['1M', '3M', '6M', '1Y', 'ALL'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-2 py-1 text-sm rounded ${
                  timeRange === range
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                } mr-2`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">
            Strategy Performance: <span className={strategyPerformance >= 0 ? 'text-green-600' : 'text-red-600'}>{formatPercentage(strategyPerformance)}</span>
          </p>
          <p className="text-sm font-medium">
            Benchmark Performance: <span className={benchmarkPerformance >= 0 ? 'text-green-600' : 'text-red-600'}>{formatPercentage(benchmarkPerformance)}</span>
          </p>
        </div>
      </div>
      <div className="h-[400px]">
        <Line data={chartData} options={chartOptions} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-medium">Start Date:</p>
          <p>{formatDate(filteredDates[0])}</p>
        </div>
        <div>
          <p className="font-medium">End Date:</p>
          <p>{formatDate(filteredDates[filteredDates.length - 1])}</p>
        </div>
      </div>
    </div>
  );
}
