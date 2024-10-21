'use client';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, ScriptableContext } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { TableData, Period, KeyPerformance } from "./types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

interface PerformanceChartsProps {
  data: TableData[];
}

const chartOptions = {
  indexAxis: 'y' as const,
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      left: 0,
      right: 40, // Increased right padding for labels
      top: 5,
      bottom: 5
    }
  },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  scales: {
    x: {
      display: false,
      grid: { display: false },
      ticks: { display: false },
      border: { display: false },
    },
    y: {
      ticks: {
        font: { size: 10 }, // Slightly increased font size
        color: 'rgba(156, 163, 175, 0.9)',
        padding: 0,
        autoSkip: false,
        maxRotation: 0,
        minRotation: 0
      },
      grid: {
        display: false,
      },
      border: {
        width: 1,
        color: 'rgba(156, 163, 175, 0.5)',
      },
    },
  },
};

const PerformanceCharts: React.FC<PerformanceChartsProps> = React.memo(({ data }) => {
  const searchParams = useSearchParams();
  const currentPeriod = (searchParams.get('period') as Period) || '1w';

  const generateChartData = useMemo(() => (tableData: TableData) => {
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
        borderRadius: 2,
        barPercentage: 1, // Increased to fill more space
        categoryPercentage: 0.95, // Increased to fill more space
      }],
    };
  }, [currentPeriod]);

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
      {data.map((tableData, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-semibold mb-2 text-center text-gray-800 dark:text-gray-200">
            {tableData.title}
          </h3>
          <div className="h-[200px]">
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
                    ctx.font = '10px Arial'; // Slightly increased font size
                    ctx.fillStyle = 'rgba(156, 163, 175, 0.9)';
                    ctx.textAlign = 'right';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(
                      `${(datapoint as number).toFixed(2)}%`,
                      chartArea.right + 35, // Adjusted position
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
});

PerformanceCharts.displayName = 'PerformanceCharts';

export default PerformanceCharts;
