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

interface SignalChartProps {
  data: ChartData<"line">;
}

const SignalChart: React.FC<SignalChartProps> = ({ data }) => {
  // Calculate the date threshold for twelve months ago
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  // Filter labels and data points within the last twelve months
  const filteredLabels = data.labels?.filter((label) => {
    const date = new Date(label as string);
    return date >= twelveMonthsAgo;
  });

  const filteredDatasets = data.datasets.map((dataset) => ({
    ...dataset,
    data: dataset.data.filter((_, index) => {
      const date = new Date(data.labels![index] as string);
      return date >= twelveMonthsAgo;
    }),
  }));

  const filteredData = {
    ...data,
    labels: filteredLabels,
    datasets: filteredDatasets,
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        backgroundColor: "rgba(50, 50, 50, 0.8)",
        titleColor: "#e0e0e0",
        bodyColor: "#e0e0e0",
        borderColor: "#333",
        borderWidth: 1,
        callbacks: {
          label: (context) => `Value: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "PP",
        },
        adapters: {
          date: { locale: enUS },
        },
        grid: {
          display: false,
        },
        ticks: {
          color: "#b0b0b0",
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
        tension: 0.3,
        borderWidth: 2,
      },
      point: {
        radius: 3,
        backgroundColor: (context) => {
          const value = context.raw as number;
          return value >= 0
            ? "rgba(0, 200, 100, 0.7)"
            : "rgba(255, 80, 80, 0.7)";
        },
      },
    },
  };

  return (
    <div style={{ height: 250, width: "100%", position: "relative" }}>
      <Line data={filteredData} options={options} />
    </div>
  );
};

export default SignalChart;
