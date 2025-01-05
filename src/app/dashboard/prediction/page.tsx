"use client";

import { useEffect, useState, useMemo } from "react";
import { getPredictions, TimeSeriesPredictionResponse } from "./DataServices";
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

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement
);

const PredictionPage = () => {
  const [predictionData, setPredictionData] = useState<TimeSeriesPredictionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPredictions("SPX_EPS_Forcastor_6M");
        setPredictionData(data);
      } catch (err) {
        setError("Failed to fetch prediction data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const allDates = useMemo(() => {
    if (!predictionData) return [];
    const dates = new Set([
      ...Object.keys(predictionData.target),
      ...Object.keys(predictionData.prediction),
    ]);
    return Array.from(dates).sort();
  }, [predictionData]);

  const getAlignedData = (data: { [date: string]: number }) =>
    allDates.map((date) => data[date] || null);

  const formatDate = (dateString: string) => new Date(dateString).getFullYear().toString();

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 10,
          font: {
            size: 10, // Smaller legend font
          },
          color: '#ffffff',
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: {
          callback: function (value, index) {
            const date = allDates[index];
            return formatDate(date);
          },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
          font: {
            size: 10, // Smaller x-axis font
          },
          color: '#ffffff',
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          maxTicksLimit: 5,
          font: {
            size: 10, // Smaller y-axis font
          },
          color: '#ffffff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
      y1: {
        ticks: {
          font: {
            size: 10, // Smaller y-axis font for secondary axis
          },
          color: '#ffffff',
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;
  if (!predictionData) return <div className="text-gray-500 text-center mt-4">No data found</div>;

  const targetPredictionData = {
    labels: allDates,
    datasets: [
      {
        label: "Target",
        data: getAlignedData(predictionData.target),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
        yAxisID: "y", // Use primary y-axis
      },
      {
        label: "Prediction",
        data: getAlignedData(predictionData.prediction),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
        tension: 0.4,
        yAxisID: "y", // Use primary y-axis
      },
    ],
  };

  return (
    <div className=" p-4">
      <div className="max-w-5xl mx-auto rounded-lg shadow-lg p-4">
        <h1 className="text-2xl font-semibold mb-4 text-white">Predictions and Features</h1>

        <div className="mb-6 bg-gray-700 rounded-lg shadow p-3">
          <div className="h-48">
            <Line data={targetPredictionData} options={chartOptions} />
          </div>
        </div>

        <h2 className="text-xl font-medium mb-2 text-white">Feature Comparisons</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mt-2">
          {Object.entries(predictionData.features).map(([featureKey, featureData]) => (
            <div key={featureKey} className="bg-gray-700 rounded-lg shadow p-3">
              <h3 className="text-sm font-medium mb-1 text-white">{featureKey} vs Target</h3>
              <div className="h-40">
                <Line
                  data={{
                    labels: allDates,
                    datasets: [
                      {
                        label: featureKey,
                        data: getAlignedData(featureData),
                        borderColor: "rgba(255, 159, 64, 1)",
                        backgroundColor: "rgba(255, 159, 64, 0.2)",
                        fill: true,
                        tension: 0.4,
                        yAxisID: "y1", // Use secondary y-axis
                      },
                      {
                        label: "Target",
                        data: getAlignedData(predictionData.target),
                        borderColor: "rgba(75, 192, 192, 1)",
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        fill: true,
                        tension: 0.4,
                        yAxisID: "y", // Use primary y-axis
                      },
                    ],
                  }}
                  options={chartOptions}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictionPage;
