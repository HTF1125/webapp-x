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

      const gradientColors = values.map((value) => {
        const gradient = ctx.createLinearGradient(0, 0, 400, 0);
        if (value > 0) {
          gradient.addColorStop(0, "rgba(128, 0, 128, 0.8)");
          gradient.addColorStop(1, "rgba(0, 0, 255, 0.8)");
        } else {
          gradient.addColorStop(0, "rgba(0, 255, 255, 0.8)");
          gradient.addColorStop(1, "rgba(0, 128, 255, 0.8)");
        }
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
        data: values,
        borderColor: values.map((value) =>
          value > 0 ? "rgba(128, 0, 128, 1)" : "rgba(0, 128, 255, 1)"
        ),
        borderWidth: 1,
      },
    ],
  };

  const minScaleValue = Math.min(...values);
  const maxScaleValue = Math.max(...values);
  const padding = (maxScaleValue - minScaleValue) * 0.1;

  const options = {
    indexAxis: "y" as const, // Horizontal bar chart
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        min: minScaleValue - padding,
        max: maxScaleValue + padding,
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: "#fff",
          autoSkip: false,
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        labels: {
          font: {
            size: 10, // Smaller font for the legend
          },
          color: "#fff", // Legend text color
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<"bar">) => {
            const value = tooltipItem.raw as number;
            return `${value > 0 ? "+" : ""}${value}%`;
          },
        },
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
      datalabels: {
        display: true,
        align: "end" as const,
        anchor: "end" as const,
        formatter: (value: number, context: Context) => {
          const signedValue = context.dataset.data[context.dataIndex] as number;
          return `${signedValue > 0 ? "+" : ""}${signedValue}%`;
        },
        font: {
          size: 10, // Smaller font for data labels
        },
        color: "#fff",
        clip: false, // Prevents cutting off data labels
      },
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        right: 100, // Adjust padding to prevent cutoff
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
    />
  );
};

export default PerformanceChart;
