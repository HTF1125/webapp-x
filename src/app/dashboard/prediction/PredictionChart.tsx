"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  ChartOptions,
} from "chart.js";
import { useMemo, useEffect, useState } from "react";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement
);

type PredictionChartProps = {
  allDates: string[];
  predictionData?: Record<string, number>;
  targetData: Record<string, number>;
  featureData?: Record<string, number>;
  featureKey?: string;
};

const PredictionChart: React.FC<PredictionChartProps> = ({
  allDates,
  predictionData,
  targetData,
  featureData,
  featureKey,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const getAlignedData = (data: Record<string, number>) =>
    allDates.map((date) => data[date] ?? null);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: "2-digit",
      month: "short",
    });

  const chartOptions: ChartOptions<"line"> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: isDarkMode ? "white" : "black",
          font: { size: 8, weight: "bold" },
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)",
        titleColor: isDarkMode ? "white" : "black",
        bodyColor: isDarkMode ? "white" : "black",
      },
      datalabels: {
        display: false, // This explicitly disables data labels
      },
    },
    scales: {
      x: {
        ticks: {
          callback: (_, index) => {
            // Show every nth label to prevent overcrowding
            return index % Math.ceil(allDates.length / 5) === 0 ? formatDate(allDates[index] || '') : '';
          },
          color: isDarkMode ? "white" : "black",
          font: { size: 8 },
          maxRotation: 0, // Prevent rotation
          autoSkip: false,
        },
        grid: { display: false },
      },
      y1: {
        type: "linear" as const,
        position: "left" as const,
        ticks: {
          color: featureData ? "rgba(153,102,255,1)" : "rgba(54,162,235,1)",
          font: { size: 8 },
        },
        grid: { display: true, color: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)" },
        title: {
          display: true,
          text: predictionData ? "Prediction / Feature" : "Feature",
          color: featureData ? "rgba(153,102,255,1)" : "rgba(54,162,235,1)",
        },
      },
      y2: {
        type: "linear" as const,
        position: "right" as const,
        ticks: {
          color: "rgba(255, 206, 86, 1)",
          font: { size: 8 },
        },
        grid: { display: false },
        title: {
          display: true,
          text: "Target",
          color: "rgba(255, 206, 86, 1)",
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
  }), [isDarkMode, allDates, predictionData, featureData]);

  const chartData = {
    labels: allDates,
    datasets: [
      {
        label: "Target",
        data: getAlignedData(targetData),
        borderColor: "rgba(255, 206, 86, 1)",
        backgroundColor: "rgba(255, 206, 86, .1)",
        tension: 0.3,
        pointRadius: 2.5,
        yAxisID: "y2",
      },
      ...(predictionData ? [{
        label: "Prediction",
        data: getAlignedData(predictionData),
        borderColor: "rgba(54,162,235,1)",
        backgroundColor: "rgba(54,162,235,.15)",
        tension: 0.3,
        pointRadius: 2.5,
        yAxisID: "y1",
      }] : []),
      ...(featureData && featureKey ? [{
        label: featureKey,
        data: getAlignedData(featureData),
        borderColor: "rgba(153,102,255,1)",
        backgroundColor: "rgba(153,102,255,.1)",
        tension: 0.3,
        pointRadius: 2.5,
        yAxisID: "y1",
      }] : []),
    ],
  };

  return (
    <div className="h-[200px]">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default PredictionChart;
