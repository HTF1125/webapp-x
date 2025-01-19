"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import {
  getPredictions,
  TimeSeriesPredictionResponse,
} from "@/services/predApi";
import { Tab } from "@headlessui/react";
import PredictionChart from "./PredictionChart";

const PredictionPage = () => {
  const [predictionData, setPredictionData] =
    useState<TimeSeriesPredictionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [, setSelectedFeature] = useState<string | null>(null);
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getPredictions("SPX_EPS_Forcastor_6M");
        setPredictionData(data);
        if (data && data.features) {
          setSelectedFeature(Object.keys(data.features)[0]);
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError("Failed to fetch prediction data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => abortController.abort();
  }, []);

  const allDates = useMemo(() => {
    if (!predictionData) return [];
    const dates = new Set([
      ...Object.keys(predictionData.target),
      ...Object.keys(predictionData.prediction),
    ]);
    return Array.from(dates).sort();
  }, [predictionData]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!predictionData) return <NoDataMessage />;

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-xl font-bold mb-2 text-left text-gray-800 dark:text-white">
          Market Predictions & Feature Insights
        </h1>

        <div className="rounded-xl">
          <h2 className="text-md font-bold mb-4 text-center text-gray-800 dark:text-white">
            Composite
          </h2>
          <PredictionChart
            allDates={allDates}
            predictionData={predictionData.prediction}
            targetData={predictionData.target}
          />

          {/* Feature Charts */}
          <div className="rounded-xl  p-6">
            <h2 className="text-md font-bold mb-2 text-center text-gray-800 dark:text-white">
              Feature Comparisons
            </h2>
            <Tab.Group>
              <Tab.List className="flex flex-wrap gap-2 justify-center mb-6">
                {Object.keys(predictionData.features).map((feature) => (
                  <Tab
                    key={feature}
                    className={({ selected }) =>
                      `px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200
                      ${
                        selected
                          ? "bg-indigo-600 text-white dark:bg-indigo-500"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`
                    }
                    onClick={() => setSelectedFeature(feature)}
                  >
                    {feature}
                  </Tab>
                ))}
              </Tab.List>

              <Tab.Panels>
                {Object.entries(predictionData.features).map(
                  ([featureKey, featureData]) => (
                    <Tab.Panel key={featureKey}>
                      <PredictionChart
                        allDates={allDates}
                        targetData={predictionData.target}
                        featureData={featureData}
                        featureKey={featureKey}
                      />
                    </Tab.Panel>
                  )
                )}
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-14 h-14 border-4 border-t-4 border-indigo-200 dark:border-gray-600 rounded-full animate-spin"></div>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center min-h-screen">
    <p className="text-red-600 dark:text-red-400 text-xl">{message}</p>
  </div>
);

const NoDataMessage = () => (
  <div className="flex items-center justify-center min-h-screen">
    <p className="text-gray-600 dark:text-gray-300 text-xl">No data found.</p>
  </div>
);

export default PredictionPage;
