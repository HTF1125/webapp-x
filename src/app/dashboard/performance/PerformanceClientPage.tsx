// src/app/dashboard/_performance/PerformancePageClient.tsx (Client-side)
"use client";

import React, { useEffect, useState } from "react";
import { usePeriod } from "./PeriodProvider";
import CompactSelector from "./CompactSelector";
import PerformanceChart from "./PerformanceChart";

interface PerformancePageClientProps {
  performanceGrouped: any[];
}

const PerformancePageClient: React.FC<PerformancePageClientProps> = ({ performanceGrouped }) => {
  const { currentPeriod } = usePeriod();
  const [data, setData] = useState<any[]>(performanceGrouped);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Re-fetch data when `currentPeriod` changes
  useEffect(() => {
    const getPerformanceData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate a fetch (you may fetch new data if needed)
        setData(performanceGrouped); // For now, using the prop data
      } catch (err) {
        setError("Failed to load performance data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getPerformanceData();
  }, [currentPeriod, performanceGrouped]);

  const transformChartData = (performanceGrouped: any[], currentPeriod: string) => {
    const groups = Array.from(new Set(performanceGrouped.map((item) => item.group)));

    return groups.map((group) => {
      const filteredData = performanceGrouped.filter((item) => item.group === group);
      const chartData = filteredData
        .map((item) => {
          const value = item[`pct_chg_${currentPeriod}`] ?? null;
          return value !== null ? { label: item.name || item.code, value } : null;
        })
        .filter((item): item is { label: string; value: number } => item !== null)
        .sort((a, b) => b.value - a.value);

      const formattedData = chartData.reduce<Record<string, number>>(
        (acc, { label, value }) => {
          acc[label] = value;
          return acc;
        },
        {}
      );

      return { group, data: formattedData };
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const chartDataByGroup = transformChartData(data, currentPeriod);

  return (
    <div className="w-full max-h-[600px] flex flex-col overflow-auto space-y-4">
      <CompactSelector />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {chartDataByGroup.map(({ group, data }) => (
          <div key={group} className="rounded-lg p-4 bg-gray-800 shadow-md">
            <h3 className="text-white text-sm font-semibold mb-2 truncate" title={group}>{group}</h3>
            {Object.keys(data).length > 0 ? (
              <div className="h-[120px] w-full">
                <PerformanceChart data={data} />
              </div>
            ) : (
              <p className="text-gray-400 text-sm italic">No data available</p>
            )}
          </div>
        ))}
      </div>
    </div>

  );
};

export default PerformancePageClient;
