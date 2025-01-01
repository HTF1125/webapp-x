"use client";

import React, { useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import ChartDataLabels, { Context } from "chartjs-plugin-datalabels";

// Register core Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type PerformanceChartProps = {
  data: Record<string, number>; // A dictionary of { label: value }
};

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  const chartRef = useRef<ChartJS<"bar"> | null>(null);

  // Sort the data by value descending
  const sortedEntries = Object.entries(data).sort(([, a], [, b]) => b - a);
  const labels = sortedEntries.map(([label]) => label);
  const values = sortedEntries.map(([, value]) => value);

  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const ctx = chart.canvas.getContext("2d");
      if (!ctx) return;

      // Create dynamic gradient colors for bars
      const gradientColors = values.map((value) => {
        const gradient = ctx.createLinearGradient(0, 0, 400, 0);
        gradient.addColorStop(
          0,
          value > 0 ? "rgba(0, 204, 102, 0.8)" : "rgba(204, 0, 0, 0.8)"
        );
        gradient.addColorStop(
          1,
          value > 0 ? "rgba(0, 102, 204, 0.8)" : "rgba(255, 51, 51, 0.8)"
        );
        return gradient;
      });

      chart.data.datasets[0].backgroundColor = gradientColors;
      chart.update();
    }
  }, [values]);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Performance",
        data: values.map((value) => Math.abs(value)), // Use absolute values for bar height
        backgroundColor: values.map((value) =>
          value < 0 ? "rgba(255, 99, 132, 0.8)" : "rgba(75, 192, 192, 0.8)"
        ), // Red for negative, green/blue for positive
        borderColor: values.map((value) =>
          value < 0 ? "rgba(255, 99, 132, 1)" : "rgba(75, 192, 192, 1)"
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: "#bbb",
          font: {
            size: 12,
          },
        },
        grid: {
          color: "#444",
        },
      },
      y: {
        ticks: {
          color: "#fff",
          autoSkip: false,
          font: {
            size: 12,
          },
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: TooltipItem<"bar">) {
            const rawValue = tooltipItem.raw as number; // Safely cast raw to number
            const originalValue = rawValue ?? 0; // Fallback to 0 if raw is undefined
            return `${originalValue > 0 ? "+" : ""}${originalValue}%`;
          },
        },
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#666",
        borderWidth: 1,
      },
      datalabels: {
        display: true,
        align: "end" as const,
        anchor: "end" as const,
        formatter: (_: number, context: Context) => {
          const signedValue = values[context.dataIndex];
          return `${signedValue > 0 ? "+" : ""}${signedValue}%`;
        },
        font: {
          size: 12,
        },
        color: "#fff",
        clip: false,
      },
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        right: 50,
        left: 10,
      },
    },
  };

  return (
    <Bar
      ref={chartRef}
      data={chartData}
      options={options}
      plugins={[ChartDataLabels]} // Scoped to this chart
      aria-label="Performance Chart"
      role="img"
    />
  );
};

export default PerformanceChart;
