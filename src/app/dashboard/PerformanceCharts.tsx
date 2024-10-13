// app/dashboard/PerformanceCharts.tsx

'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, ScriptableContext } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { TableData, Period, KeyPerformance } from "./types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

interface PerformanceChartsProps {
  data: TableData[];
}

const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ data }) => {
  const searchParams = useSearchParams();
  const currentPeriod = (searchParams.get('period') as Period) || '1w';

  const chartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          font: { size: 10 },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const generateChartData = (tableData: TableData) => {
    const sortedData = [...tableData.data]
      .sort((a, b) =>
        (b[`pct_chg_${currentPeriod}` as keyof KeyPerformance] as number) -
        (a[`pct_chg_${currentPeriod}` as keyof KeyPerformance] as number)
      )
      .slice(0, 10);

    return {
      labels: sortedData.map(item => item.code),
      datasets: [{
        data: sortedData.map(item => item[`pct_chg_${currentPeriod}` as keyof KeyPerformance]),
        backgroundColor: (context: ScriptableContext<'bar'>) => {
          const value = context.raw as number;
          return value >= 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)';
        },
        borderColor: (context: ScriptableContext<'bar'>) => {
          const value = context.raw as number;
          return value >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)';
        },
        borderWidth: 1,
      }],
    };
  };

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((tableData, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-center text-gray-800 dark:text-gray-200">
            {tableData.title}
          </h3>
          <div style={{ height: '200px' }}>
            <Bar
              options={chartOptions}
              data={generateChartData(tableData)}
              plugins={[{
                id: 'customDataLabels',
                afterDatasetsDraw(chart) {
                  const { ctx, data, scales, chartArea } = chart;
                  ctx.save();
                  data.datasets[0].data.forEach((datapoint, index) => {
                    const y = scales.y.getPixelForTick(index);
                    ctx.font = '10px Arial';
                    ctx.fillStyle = 'black';
                    ctx.textAlign = 'right';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(
                      `${(datapoint as number).toFixed(2)}%`,
                      chartArea.right,
                      y
                    );
                  });
                  ctx.restore();
                }
              }]}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PerformanceCharts;
