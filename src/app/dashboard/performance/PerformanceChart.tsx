"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
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

// Register necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type PerformanceChartProps = {
  data: Record<string, number>;
};

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  const chartRef = useRef<ChartJS<"bar"> | null>(null);
  const [yAxisFontSize, setYAxisFontSize] = useState(12);
  const [dataLabelFontSize, setDataLabelFontSize] = useState(12);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sort the data entries
  const sortedEntries = useMemo(() => {
    return Object.entries(data).sort(([, a], [, b]) => b - a);
  }, [data]);

  const labels = sortedEntries.map(([label]) => label);
  const values = sortedEntries.map(([, value]) => value);

  // Memoize gradient colors to avoid recalculating on every render
  const gradientColors = useMemo(() => {
    const ctx = chartRef.current?.canvas.getContext("2d");
    if (!ctx) return [];

    return values.map((value) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
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
  }, [values]);

  // Detect dark mode changes
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode(); // Initial check

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Adjust font sizes based on chart height
  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const chartHeight = chart.height;

      const newYAxisFontSize = Math.max(8, Math.min(14, Math.floor(chartHeight / 20)));
      const newDataLabelFontSize = Math.max(8, Math.min(12, Math.floor(chartHeight / 25)));

      setYAxisFontSize(newYAxisFontSize);
      setDataLabelFontSize(newDataLabelFontSize);

      // Re-render the chart when the theme changes
      chart.update();
    }
  }, [isDarkMode]);

  // Chart options
  const options = useMemo(
    () => ({
      indexAxis: "y" as const,
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          display: false,
        },
        y: {
          ticks: {
            color: isDarkMode ? "#fff" : "#000",
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
          enabled: true,
          callbacks: {
            label: (tooltipItem: TooltipItem<"bar">) => {
              const value = tooltipItem.raw as number;
              return `${value > 0 ? "+" : "-"}${Math.abs(value)}%`;
            },
          },
          backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)",
          titleColor: isDarkMode ? "#fff" : "#000",
          bodyColor: isDarkMode ? "#fff" : "#000",
          borderColor: isDarkMode ? "#666" : "#ccc",
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
          color: isDarkMode ? "#fff" : "#000",
          clip: false,
        },
      },
      layout: {
        padding: {
          top: 5,
          bottom: 5,
          right: 35,
          left: 5,
        },
      },
    }),
    [yAxisFontSize, dataLabelFontSize, values, isDarkMode]
  );

  // Chart data
  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Performance",
          data: values.map((value) => Math.abs(value)),
          backgroundColor: gradientColors,
          borderColor: values.map((value) =>
            value < 0 ? "rgba(255,99,132)" : "rgba(75,192,192)"
          ),
          borderWidth: 1,
        },
      ],
    }),
    [labels, values, gradientColors]
  );

  return (
    <div className="w-full max-h-[100px] overflow-hidden" role="region" aria-label="Performance Chart">
      <Bar
        ref={chartRef}
        data={chartData}
        options={options}
        plugins={[ChartDataLabels]}
        aria-label="Performance Chart"
        role="img"
      />
    </div>
  );
};

export default PerformanceChart;
