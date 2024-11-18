"use client";

import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register only necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

interface BarChartProps {
  title: string;
  data: { label: string; value: number }[];
}

const BarChart: React.FC<BarChartProps> = ({ title, data }) => {
  // Define chartData with proper typing
  const chartData: ChartData<"bar"> = useMemo(() => {
    const sortedData = [...data].sort((a, b) => b.value - a.value);

    return {
      labels: sortedData.map((item) => item.label),
      datasets: [
        {
          label: title,
          data: sortedData.map((item) => item.value),
          backgroundColor: sortedData.map(
            (_, index) =>
              `rgba(${50 + index * 15}, ${200 - index * 10}, 255, 0.8)` // Vibrant gradient colors
          ),
          borderColor: "#ffffff",
          borderWidth: 2,
          borderRadius: 2,
          barPercentage: 0.85,
          categoryPercentage: 1,
          datalabels: {
            display: true,
            anchor: "end",
            align: "right",
            color: "#ffffff", // White color for labels
            font: {
              size: 10,
              family: "Arial",
            },
            formatter: (value: number) => `${value.toFixed(2)}%`, // Format data labels
          },
        },
      ],
    };
  }, [data, title]);

  // Define chartOptions with proper typing
  const chartOptions: ChartOptions<"bar"> = useMemo(
    () => ({
      indexAxis: "y", // Horizontal bars
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: { left: 0, right: 40, top: 5, bottom: 5 },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: "rgba(30, 30, 30, 0.9)", // Darker tooltip background
          borderColor: "#00ffcc",
          borderWidth: 1,
          callbacks: {
            label: (context) => `${context.raw}%`,
          },
        },
      },
      scales: {
        x: {
          display: false,
          grid: { display: false },
          ticks: { display: false },
        },
        y: {
          ticks: {
            autoSkip: false, // Ensure no labels are skipped
            font: { size: 10 },
            color: "#ffffff", // White text for labels
            padding: 4, // Adds some space around the labels
          },
          grid: { display: false },
        },
      },
    }),
    []
  );

  return (
    <div className="bg-transparent p-4 rounded-lg shadow-sm">
      <h3 className="text-sm font-semibold mb-2 text-center text-white">
        {title}
      </h3>
      <div style={{ height: 150, width: "100%", position: "relative" }}>
        {/* Pass ChartDataLabels as a local plugin */}
        <Bar options={chartOptions} data={chartData} plugins={[ChartDataLabels]} />
      </div>
    </div>
  );
};

export default BarChart;
