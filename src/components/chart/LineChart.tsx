"use client";

import React from "react";
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
  ChartOptions,
  ChartData,
  ChartDataset,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { enUS } from "date-fns/locale";

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  title: string;
  data: ChartData<"line", { x: Date | string | number; y: number }[]>;
}

const LineChart: React.FC<LineChartProps> = ({ title, data }) => {
  const filteredData = {
    ...data,
    datasets: data.datasets.map((dataset, datasetIndex) => {
      // Dynamic colors based on dataset index
      const colorR = 50 + datasetIndex * 20;
      const colorG = 200 - datasetIndex * 15;
      const colorB = 255;

      return {
        ...dataset,
        borderColor: `rgba(${colorR}, ${colorG}, ${colorB}, 0.8)`,
        backgroundColor: `rgba(${colorR}, ${colorG}, ${colorB}, 0.3)`,
        tension: 0.3, // Smooth lines
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: (context) => {
          const value = (context.raw as { x: Date | string | number; y: number }).y; // Explicit cast
          return value >= 0
            ? "rgba(0, 200, 100, 0.7)" // Green for positive values
            : "rgba(255, 80, 80, 0.7)"; // Red for negative values
        },
        pointBorderColor: "#ffffff",
        pointBorderWidth: 1,
      } as ChartDataset<"line", { x: Date | string | number; y: number }[]>; // Ensure proper typing for datasets
    }),
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: title,
        color: "#ffffff",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        backgroundColor: "rgba(30, 30, 30, 0.9)",
        titleColor: "#e0e0e0",
        bodyColor: "#e0e0e0",
        borderColor: "#555",
        borderWidth: 1,
        callbacks: {
          label: (context) => `Value: ${context.parsed.y}`,
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
          unit: "year", // Use 'year' to reduce overcrowding
          displayFormats: {
            year: "yyyy",
          },
        },
        adapters: {
          date: { locale: enUS },
        },
        grid: {
          display: false, // Remove vertical grid lines
        },
        ticks: {
          color: "#b0b0b0",
          maxTicksLimit: 5, // Limit the number of labels
          autoSkip: true,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#b0b0b0",
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
    <div style={{ height: 250, width: "100%", position: "relative" }}>
      <Line data={filteredData} options={options} />
    </div>
  );
};

export default LineChart;
