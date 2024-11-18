"use client";

import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { enUS } from "date-fns/locale";

// Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip
);

interface SignalChartProps {
  data: ChartData<"line">;
  title: string;
}

const SignalChart: React.FC<SignalChartProps> = ({ data, title }) => {
  const threeYearsAgo = useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 3); // Get date 3 years ago
    return date;
  }, []);

  const filteredData = useMemo(() => {
    if (!data.labels || !data.datasets.length) return data;

    const labels = data.labels as (string | Date)[];
    const filteredIndices = labels.reduce<number[]>((indices, label, index) => {
      const date = new Date(label); // Convert label to Date
      if (!isNaN(date.getTime()) && date >= threeYearsAgo) {
        indices.push(index);
      }
      return indices;
    }, []);

    return {
      ...data,
      labels: filteredIndices.map((index) => data.labels![index]),
      datasets: data.datasets.map((dataset) => ({
        ...dataset,
        data: filteredIndices.map((index) => dataset.data[index]),
      })),
    };
  }, [data, threeYearsAgo]);

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        mode: "nearest",
        intersect: false,
        callbacks: {
          label: (context) => `${context.raw}`, // Show raw value in tooltip
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: { tooltipFormat: "PP" },
        adapters: { date: { locale: enUS } },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { color: "#cbd5e1", font: { size: 12 } }, // Softer text for ticks
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { color: "#cbd5e1", font: { size: 12 } },
      },
    },
    elements: {
      line: {
        borderWidth: 2,
        tension: 0.4,
      },
      point: {
        radius: 3,
      },
    },
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-4 rounded-lg shadow-md">
      <h3 className="text-sm font-semibold mb-4 text-center text-gray-200">
        {title}
      </h3>
      <div className="h-[200px]">
        <Line options={chartOptions} data={filteredData} />
      </div>
    </div>
  );
};

export default SignalChart;
