"use client";

import React, { useRef, useEffect, useState } from "react";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type PerformanceChartProps = {
  data: Record<string, number>;
};

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  const chartRef = useRef<ChartJS<"bar"> | null>(null);
  const [yAxisFontSize, setYAxisFontSize] = useState(12);
  const [dataLabelFontSize, setDataLabelFontSize] = useState(12);

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

      // Calculate and set font sizes based on chart height
      const chartHeight = chart.height;
      const newYAxisFontSize = Math.max(8, Math.min(14, Math.floor(chartHeight / 20)));
      const newDataLabelFontSize = Math.max(8, Math.min(12, Math.floor(chartHeight / 25)));
      setYAxisFontSize(newYAxisFontSize);
      setDataLabelFontSize(newDataLabelFontSize);
    }
  }, [values]);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Performance",
        data: values.map((value) => Math.abs(value)),
        backgroundColor: values.map((value) =>
          value < 0 ? "rgba(255, 99, 132, 0.8)" : "rgba(75, 192, 192, 0.8)"
        ),
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
            size: yAxisFontSize,
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
            size: yAxisFontSize,
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
            const rawValue = tooltipItem.raw as number;
            const originalValue = rawValue ?? 0;
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
          size: dataLabelFontSize,
        },
        color: "#fff",
        clip: false,
      },
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10,
        right: 40,
        left: 10,
      },
    },
  };

  return (
    <Bar
      ref={chartRef}
      data={chartData}
      options={options}
      plugins={[ChartDataLabels]}
      aria-label="Performance Chart"
      role="img"
    />
  );
};

export default PerformanceChart;
