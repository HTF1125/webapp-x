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
import { Tab } from '@headlessui/react';

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
  const [, setSelectedFeature] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPredictions("SPX_EPS_Forcastor_6M");
        setPredictionData(data);
        if (data && data.features) {
          setSelectedFeature(Object.keys(data.features)[0]);
        }
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

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  const mainChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: '#ffffff' },
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
            return formatDate(allDates[index]);
          },
          maxRotation: 45,
          color: '#ffffff',
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      y: {
        ticks: { color: '#ffffff' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  const featureChartOptions: ChartOptions<'line'> = {
    ...mainChartOptions,
    scales: {
      ...mainChartOptions.scales,
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: { color: '#ffffff' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        ticks: { color: '#ffffff' },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;
  if (!predictionData) return <div className="text-gray-500 text-center mt-4">No data found</div>;

  const mainChartData = {
    labels: allDates,
    datasets: [
      {
        label: "Target",
        data: getAlignedData(predictionData.target),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
      {
        label: "Validation",
        data: getAlignedData(predictionData.validation),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.2,
      },
      {
        label: "Prediction",
        data: getAlignedData(predictionData.prediction),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Predictions and Features</h1>
        
        <div className="bg-gray-800 rounded-xl shadow-xl p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/2">
              <h2 className="text-2xl font-semibold mb-4">Main Prediction</h2>
              <div className="h-[400px]">
                <Line data={mainChartData} options={mainChartOptions} />
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <h2 className="text-2xl font-semibold mb-4">Feature Comparisons</h2>
              <Tab.Group>
                <Tab.List className="flex flex-wrap gap-2 mb-4">
                  {Object.keys(predictionData.features).map((feature) => (
                    <Tab
                      key={feature}
                      className={({ selected }) =>
                        `px-3 py-2 rounded-lg text-sm font-medium leading-5 
                        ${selected
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
                        }`
                      }
                      onClick={() => setSelectedFeature(feature)}
                    >
                      {feature}
                    </Tab>
                  ))}
                </Tab.List>
                <Tab.Panels>
                  {Object.entries(predictionData.features).map(([featureKey, featureData]) => (
                    <Tab.Panel key={featureKey}>
                      <div className="h-[300px]">
                        <Line
                          data={{
                            labels: allDates,
                            datasets: [
                              {
                                label: featureKey,
                                data: getAlignedData(featureData),
                                borderColor: "rgba(255, 159, 64, 1)",
                                backgroundColor: "rgba(255, 159, 64, 0.2)",
                                tension: 0.4,
                                yAxisID: 'y',
                              },
                              {
                                label: "Target",
                                data: getAlignedData(predictionData.target),
                                borderColor: "rgba(75, 192, 192, 1)",
                                backgroundColor: "rgba(75, 192, 192, 0.2)",
                                tension: 0.4,
                                yAxisID: 'y1',
                              },
                            ],
                          }}
                          options={featureChartOptions}
                        />
                      </div>
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              </Tab.Group>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionPage;
