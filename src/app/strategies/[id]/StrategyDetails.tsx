"use client";

import React, { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Strategy } from "../types";
import { formatDate, formatPercentage } from "@/lib/fmt";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StrategyDetailsProps {
  strategy: Strategy | null; // Allow for null to handle loading state
}

const TIME_RANGES = ["1M", "3M", "6M", "1Y", "3Y", "5Y", "ALL"] as const;
type TimeRange = (typeof TIME_RANGES)[number];

const StrategyDetails: React.FC<StrategyDetailsProps> = ({ strategy }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("ALL");
  const [isLogScale, setIsLogScale] = useState(true);

  const { filteredStrategyData, filteredBenchmarkData, filteredDates } =
    useMemo(() => {
      if (!strategy || !strategy.book) {
        return {
          filteredStrategyData: [],
          filteredBenchmarkData: [],
          filteredDates: [],
        };
      }

      const { filteredData: strategyData, filteredDates } =
        filterDataByTimeRange(
          strategy.book.v || [],
          strategy.book.d || [],
          timeRange
        );
      const { filteredData: benchmarkData } = filterDataByTimeRange(
        strategy.book.b || [],
        strategy.book.d || [],
        timeRange
      );
      return {
        filteredStrategyData: normalizeData(strategyData),
        filteredBenchmarkData: normalizeData(benchmarkData),
        filteredDates,
      };
    }, [strategy, timeRange]);

  if (!strategy) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loader">Loading...</div> {/* Loading Spinner */}
      </div>
    );
  }

  const chartData = createChartData(
    filteredDates,
    filteredStrategyData,
    filteredBenchmarkData
  );

  const chartOptions = createChartOptions(timeRange, isLogScale);

  return (
    <div className="w-full p-4 sm:p-6 md:p-8 lg:p-10">
      <h2 className="text-2xl font-semibold mb-4">Strategy: {strategy.code}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Last Updated
          </p>
          <p className="text-lg font-medium">
            {formatDate(strategy.last_updated)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Annual Return
          </p>
          <p className="text-lg font-medium">
            {formatPercentage(strategy.ann_return)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Annual Volatility
          </p>
          <p className="text-lg font-medium">
            {formatPercentage(strategy.ann_volatility)}
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />
        <ScaleToggle isLogScale={isLogScale} setIsLogScale={setIsLogScale} />
      </div>
      <div className="w-full h-[600px]">
        <Line data={chartData} options={chartOptions} />
      </div>
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
  if (data.length === 0) return [];

  const startValue = data[0];

  // Avoid division by zero if startValue is zero.
  return data.map((value) => (startValue !== 0 ? value / startValue : value));
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
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: false,
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        label: "Benchmark",
        data: benchmarkData,
        borderColor: "rgba(255 ,99 ,132 ,1)",
        backgroundColor: "rgba(255 ,99 ,132 ,0.2)",
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
        grid: {
          color: "rgba(255,255,255,0.2)", // Set grid line color for x-axis
        },
      },
      y: {
        type: isLogScale ? "logarithmic" : "linear",
        title: {
          display: true,
          text: `Value (${isLogScale ? "Log" : "Linear"} Scale)`,
        },
        ticks: {
          callback(value) {
            return typeof value === "number" ? value.toFixed(2) : value;
          },
        },
        grid: {
          color: "rgba(255,255,255,0.2)", // Set grid line color for y-axis
        },
      },
    },
    elements: { point: { radius: 0 } },
  };
}

export default StrategyDetails;
