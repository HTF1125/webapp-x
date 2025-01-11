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
  predictionData?: any;
  targetData: any;
  featureData?: any;
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

  const getAlignedData = (data: { [date: string]: number }) =>
    allDates.map((date) => data[date] ?? null);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const chartOptions: ChartOptions<"line"> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: isDarkMode ? "white" : "black",
          font: { size: 12, weight: "bold" },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)",
        titleColor: isDarkMode ? "white" : "black",
        bodyColor: isDarkMode ? "white" : "black",
      },
    },
    scales: {
      x: {
        ticks: {
          callback: (_, index) => formatDate(allDates[index]),
          color: isDarkMode ? "white" : "black",
          font: { size: 11 },
          maxRotation: 45,
        },
        grid: { display: false },
      },
      y1: {
        type: "linear",
        position: "left",
        ticks: {
          color: isDarkMode ? "white" : "black",
          font: { size: 10 },
        },
        grid: { display: true, color: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)" },
        title: {
          display: true,
          text: predictionData ? "Prediction / Feature" : "Feature",
          color: isDarkMode ? "white" : "black",
        },
      },
      y2: {
        type: "linear",
        position: "right",
        ticks: {
          color: isDarkMode ? "white" : "black",
          font: { size: 10 },
        },
        grid: { display: false },
        title: {
          display: true,
          text: "Target",
          color: isDarkMode ? "white" : "black",
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  }), [isDarkMode, allDates, predictionData]);

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
      predictionData && {
        label: "Prediction",
        data: getAlignedData(predictionData),
        borderColor: "rgba(54,162,235,1)",
        backgroundColor: "rgba(54,162,235,.15)",
        tension: 0.3,
        pointRadius: 2.5,
        yAxisID: "y1",
      },
      featureData && {
        label: featureKey,
        data: getAlignedData(featureData),
        borderColor: "rgba(153,102,255,1)",
        backgroundColor: "rgba(153,102,255,.1)",
        tension: 0.3,
        pointRadius: 2.5,
        yAxisID: "y1",
      },
    ].filter(Boolean),
  };

  return (
    <div className="h-[300px]">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default PredictionChart;
