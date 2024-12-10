"use client";

import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData,
  ScriptableContext,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { enUS } from "date-fns/locale";
import { format } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const POSITIVE_GRADIENT_START = "rgba(0, 204, 102, 1)";
const POSITIVE_GRADIENT_END = "rgba(102, 255, 204, 0.5)";
const NEGATIVE_GRADIENT_END = "rgba(255, 178, 178, 0.5)";
const GRID_COLOR = "rgba(255, 255, 255, 0.1)";
const TICK_COLOR = "#CCCCCC";

interface SignalChartProps {
  title: string;
  data: ChartData<"line", { x: number; y: number }[]>;
}

const SignalChart: React.FC<SignalChartProps> = ({ title, data }) => {
  const formattedData = useMemo(() => {
    return {
      ...data,
      datasets: data.datasets.map((dataset) => ({
        ...dataset,
        data: dataset.data.map((point) => ({
          x: new Date(point.x).getTime(),
          y: point.y,
        })),
        borderColor: (context: ScriptableContext<"line">) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return POSITIVE_GRADIENT_START;
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top
          );
          gradient.addColorStop(0, NEGATIVE_GRADIENT_END);
          gradient.addColorStop(0.5, "#FFFFFF");
          gradient.addColorStop(1, POSITIVE_GRADIENT_END);
          return gradient;
        },
        backgroundColor: "transparent",
        tension: 0.4,
        fill: false,
        pointRadius: 2,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#FFFFFF",
        pointHoverBorderColor: "#000000",
        pointHoverBorderWidth: 2,
      })),
    };
  }, [data]);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#FFFFFF",
        bodyColor: "#FFFFFF",
        borderColor: "#555555",
        borderWidth: 1,
        callbacks: {
          title: (tooltipItems) => {
            const date = new Date(tooltipItems[0].parsed.x as number);
            return format(date, "yyyy-MM-dd");
          },
          label: (context) => {
            const value = context.parsed.y;
            return `${value >= 0 ? "Bullish" : "Bearish"}: ${(
              Math.abs(value) * 100
            ).toFixed(0)}%`;
          },
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "month",
          displayFormats: {
            month: "MMM yyyy",
          },
        },
        adapters: {
          date: { locale: enUS },
        },
        grid: {
          color: GRID_COLOR,
        },
        ticks: {
          color: TICK_COLOR,
          autoSkip: true,
          maxTicksLimit: 6,
          font: {
            size: 10,
          },
        },
      },
      y: {
        min: -1,
        max: 1,
        grid: {
          color: GRID_COLOR,
        },
        ticks: {
          color: TICK_COLOR,
          callback: (value) => {
            const numericValue = Number(value);
            return numericValue > 0
              ? `+${(numericValue * 100).toFixed(0)}%`
              : `${(numericValue * 100).toFixed(0)}%`;
          },
          font: {
            size: 10,
          },
        },
      },
    },
    elements: {
      line: {
        borderWidth: 2,
      },
    },
  };

  return (
    <div className="p-4 rounded-lg shadow-md bg-gray-800 border border-gray-700">
      <h3 className="text-sm font-semibold mb-3 text-center text-gray-200">
        {title}
      </h3>
      <div style={{ height: 200, width: "100%", position: "relative" }}>
        <Line data={formattedData} options={options} />
      </div>
    </div>
  );
};

export default SignalChart;
