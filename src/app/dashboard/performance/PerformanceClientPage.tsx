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
    <div className="w-full max-h-[600px] flex flex-col overflow-auto">
      <CompactSelector />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mt-2">
        {chartDataByGroup.map(({ group, data }) => (
          <div key={group} className="rounded p-2 text-center bg-gray-800">
            <h3 className="text-white text-xs font-bold mb-1 truncate">{group}</h3>
            {Object.keys(data).length > 0 ? (
              <div style={{ height: "150px", width: "100%" }}>
                <PerformanceChart data={data} />
              </div>
            ) : (
              <p className="text-gray-400 text-xs">No data available</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformancePageClient;
