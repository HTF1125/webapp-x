// app/strategies/StrategyDetails.tsx

import React, { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { StrategyPerformance } from "./types";
import { formatPercentage, formatDate } from "@/lib/fmt";

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

const StrategyDetails: React.FC<StrategyDetailsProps> = ({
  performanceData,
}) => {
  const [timeRange, setTimeRange] = useState<"1M" | "3M" | "6M" | "1Y" | "ALL">(
    "ALL"
  );

  const filterDataByTimeRange = (data: number[], dates: string[]) => {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case "1M":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "3M":
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case "6M":
        startDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case "1Y":
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
      filteredData: filteredIndices.map((i) => data[i]),
      filteredDates: filteredIndices.map((i) => dates[i]),
    };
  };

  const normalizeData = (data: number[]) => {
    const startValue = data[0];
    return data.map((value) => ((value - startValue) / startValue) * 100);
  };

  const { filteredData: strategyData, filteredDates } = useMemo(
    () => filterDataByTimeRange(performanceData.v, performanceData.d),
    [performanceData, timeRange]
  );

  const { filteredData: benchmarkData } = useMemo(
    () => filterDataByTimeRange(performanceData.b, performanceData.d),
    [performanceData, timeRange]
  );

  const normalizedStrategyData = useMemo(
    () => (timeRange !== "ALL" ? normalizeData(strategyData) : strategyData),
    [strategyData, timeRange]
  );

  const normalizedBenchmarkData = useMemo(
    () => (timeRange !== "ALL" ? normalizeData(benchmarkData) : benchmarkData),
    [benchmarkData, timeRange]
  );

  const chartData = {
    labels: filteredDates,
    datasets: [
      {
        label: "Strategy Value",
        data: normalizedStrategyData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.1)",
        fill: true,
        pointRadius: 0, // Remove dots
      },
      {
        label: "Benchmark",
        data: normalizedBenchmarkData,
        borderColor: "rgba(255,99,132,1)",
        backgroundColor: "rgba(255,99,132,0.1)",
        fill: true,
        pointRadius: 0, // Remove dots
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Strategy vs Benchmark Performance",
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label +=
                timeRange !== "ALL"
                  ? formatPercentage(context.parsed.y / 100)
                  : context.parsed.y.toFixed(2);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: timeRange !== "ALL" ? "Percentage Change" : "Value",
        },
        ticks: {
          callback: function (value: number | string) {
            if (typeof value === "number") {
              return timeRange !== "ALL"
                ? formatPercentage(value / 100)
                : value.toFixed(2);
            }
            return value;
          },
        },
      },
    },
    elements: {
      point: {
        radius: 0, // Ensure no points are displayed
      },
    },
  };

  return (
    <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Performance Analysis</h3>
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Time Range:
          </p>
          <div className="mt-1">
            {["1M", "3M", "6M", "1Y", "ALL"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-2 py-1 text-sm rounded ${
                  timeRange === range
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                } mr-2`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="h-[400px]">
        <Line data={chartData} options={options} />
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
};

export default StrategyDetails;
