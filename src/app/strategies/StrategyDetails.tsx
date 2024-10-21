// app/strategies/StrategyDetails.tsx

import React, { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { StrategyPerformance } from "./types";
import { formatDate } from "@/lib/fmt";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StrategyDetailsProps {
  performanceData: StrategyPerformance;
}

const TIME_RANGES = ["1M", "3M", "6M", "1Y", "3Y", "5Y", "ALL"] as const;
type TimeRange = (typeof TIME_RANGES)[number];

const StrategyDetails: React.FC<StrategyDetailsProps> = ({
  performanceData,
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("ALL");
  const [isLogScale, setIsLogScale] = useState(true);

  const { filteredStrategyData, filteredBenchmarkData, filteredDates } =
    useMemo(() => {
      const { filteredData: strategyData, filteredDates } =
        filterDataByTimeRange(performanceData.v, performanceData.d, timeRange);
      const { filteredData: benchmarkData } = filterDataByTimeRange(
        performanceData.b,
        performanceData.d,
        timeRange
      );
      return {
        filteredStrategyData: normalizeData(strategyData),
        filteredBenchmarkData: normalizeData(benchmarkData),
        filteredDates,
      };
    }, [performanceData, timeRange]);

  const chartData = createChartData(
    filteredDates,
    filteredStrategyData,
    filteredBenchmarkData
  );
  const chartOptions = createChartOptions(timeRange, isLogScale);

  return (
    <div className="w-full mt-4 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Performance Analysis</h3>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />
        <ScaleToggle isLogScale={isLogScale} setIsLogScale={setIsLogScale} />
      </div>
      <div className="w-full h-[400px]">
        <Line data={chartData} options={chartOptions} />
      </div>
      <PerformanceSummary
        startDate={filteredDates[0]}
        endDate={filteredDates[filteredDates.length - 1]}
      />
    </div>
  );
};

const TimeRangeSelector: React.FC<{
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}> = ({ timeRange, setTimeRange }) => (
  <div className="w-full sm:w-auto">
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Time Range:</p>
    <div className="flex flex-wrap gap-2">
      {TIME_RANGES.map((range) => (
        <button
          key={range}
          onClick={() => setTimeRange(range)}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            timeRange === range
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {range}
        </button>
      ))}
    </div>
  </div>
);

const ScaleToggle: React.FC<{
  isLogScale: boolean;
  setIsLogScale: (isLog: boolean) => void;
}> = ({ isLogScale, setIsLogScale }) => (
  <div className="w-full sm:w-auto">
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Scale:</p>
    <div className="flex gap-2">
      <button
        onClick={() => setIsLogScale(true)}
        className={`px-3 py-1 text-sm rounded transition-colors ${
          isLogScale
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        }`}
      >
        Log
      </button>
      <button
        onClick={() => setIsLogScale(false)}
        className={`px-3 py-1 text-sm rounded transition-colors ${
          !isLogScale
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        }`}
      >
        Linear
      </button>
    </div>
  </div>
);

const PerformanceSummary: React.FC<{ startDate: string; endDate: string }> = ({
  startDate,
  endDate,
}) => (
  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
    <div>
      <p className="font-medium">Start Date:</p>
      <p>{formatDate(startDate)}</p>
    </div>
    <div>
      <p className="font-medium">End Date:</p>
      <p>{formatDate(endDate)}</p>
    </div>
  </div>
);

function filterDataByTimeRange(
  data: number[],
  dates: string[],
  timeRange: TimeRange
) {
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
    case "3Y":
      startDate = new Date(now.setFullYear(now.getFullYear() - 3));
      break;
    case "5Y":
      startDate = new Date(now.setFullYear(now.getFullYear() - 5));
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
}

function normalizeData(data: number[]) {
  const startValue = data[0];
  return data.map((value) => value / startValue);
}

function createChartData(
  dates: string[],
  strategyData: number[],
  benchmarkData: number[]
) {
  return {
    labels: dates,
    datasets: [
      {
        label: "Strategy Value",
        data: strategyData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.1)",
        fill: false,
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        label: "Benchmark",
        data: benchmarkData,
        borderColor: "rgba(255,99,132,1)",
        backgroundColor: "rgba(255,99,132,0.1)",
        fill: false,
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  };
}

function createChartOptions(
  timeRange: TimeRange,
  isLogScale: boolean
): ChartOptions<"line"> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Strategy vs Benchmark Performance" },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value =
              context.parsed.y !== null ? context.parsed.y.toFixed(2) : "";
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Date" },
        ticks: {
          maxTicksLimit: 8,
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        type: isLogScale ? "logarithmic" : "linear",
        title: {
          display: true,
          text: `Value (${isLogScale ? "Log" : "Linear"} Scale)`,
        },
        ticks: {
          callback: (value) =>
            typeof value === "number" ? value.toFixed(2) : value,
        },
      },
    },
    elements: { point: { radius: 0 } },
  };
}

export default StrategyDetails;
