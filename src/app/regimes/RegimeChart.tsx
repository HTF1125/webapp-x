"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-date-fns";
import { enUS } from "date-fns/locale";

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin,
  zoomPlugin
);

interface RegimeChartProps {
  data: Record<string, string>;
}

export default function RegimeChart({ data }: RegimeChartProps) {
  const [chartData, setChartData] = useState<any>(null);
  const chartRef = useRef<ChartJS>(null);

  useEffect(() => {
    if (!data) return;

    const dates = Object.keys(data).map((date) => new Date(date));
    const regimes = Object.values(data);
    const uniqueRegimes = Array.from(new Set(regimes));

    const regimeColors = uniqueRegimes.reduce((acc, regime, index) => {
      const hue = (index * 360) / uniqueRegimes.length;
      acc[regime] = `hsla(${hue}, 70%, 60%, 0.3)`;
      return acc;
    }, {} as Record<string, string>);

    const annotations = dates.map((date, index) => ({
      type: "box" as const,
      xMin: date,
      xMax: index < dates.length - 1 ? dates[index + 1] : undefined,
      yMin: 0,
      yMax: 1,
      backgroundColor: regimeColors[regimes[index]],
      borderWidth: 0,
    }));

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "time" as const,
          time: {
            unit: "year" as const,
            displayFormats: {
              year: "yyyy",
            },
          },
          title: {
            display: true,
            text: "Date",
          },
          adapters: {
            date: {
              locale: enUS,
            },
          },
        },
        y: {
          display: false,
          min: 0,
          max: 1,
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top" as const,
          labels: {
            generateLabels: () => {
              return uniqueRegimes.map((regime) => ({
                text: regime,
                fillStyle: regimeColors[regime],
                strokeStyle: regimeColors[regime],
                lineWidth: 0,
                hidden: false,
              }));
            },
          },
          onClick: () => {}, // Disable legend click events
        },
        tooltip: {
          mode: "index",
          intersect: false,
          callbacks: {
            title: (context: any) => {
              if (context[0].label) {
                return new Date(context[0].label).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                });
              }
              return "";
            },
            label: (context: any) => {
              const date = new Date(context.label);
              const regime = data[date.toISOString().split("T")[0]];
              return `Regime: ${regime}`;
            },
          },
        },
        annotation: {
          annotations: annotations,
        },
        zoom: {
          pan: {
            enabled: true,
            mode: "x",
          },
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: "x",
          },
        },
      },
    };

    setChartData({
      data: {
        labels: dates,
        datasets: [],
      },
      options: chartOptions,
    });
  }, [data]);

  const resetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  if (!chartData) return <div>Loading chart...</div>;

  return (
    <div>
      <div style={{ height: "400px", width: "100%" }}>
        <Chart
          ref={chartRef}
          type="line"
          data={chartData.data}
          options={chartData.options}
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