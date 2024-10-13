// app/regimes/RegimeChart.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { Chart as ChartJS, ChartData, ChartOptions } from "chart.js";
import { Chart } from "react-chartjs-2";
import { setupChartConfig } from "./chartConfig";

interface RegimeChartProps {
  data: Record<string, string>;
  startDate: Date;
}

export default function RegimeChart({ data, startDate }: RegimeChartProps) {
  const chartRef = useRef<ChartJS<"line"> | null>(null);
  const { chartData, chartOptions } = setupChartConfig(data, startDate);

  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      chart.data = chartData as ChartData<"line">;
      chart.options = chartOptions as ChartOptions<"line">;
      chart.update();
    }
  }, [data, startDate, chartData, chartOptions]);

  const resetZoom = () => {
    const chart = chartRef.current;
    if (chart) {
      chart.resetZoom();
    }
  };

  return (
    <div>
      <div style={{ height: "400px", width: "100%" }}>
        <Chart
          ref={chartRef}
          type="line"
          data={chartData as ChartData<"line">}
          options={chartOptions as ChartOptions<"line">}
        />
      </div>
      <button
        onClick={resetZoom}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
      >
        Reset Zoom
      </button>
    </div>
  );
}
