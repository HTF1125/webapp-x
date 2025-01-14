"use client";

import React, { useState } from "react";
import { usePeriod } from "./PeriodProvider";
import CompactSelector from "./CompactSelector";
import PerformanceChart from "./PerformanceChart";

interface PerformancePageClientProps {
  performanceGrouped: any[];
}

const PerformancePageClient: React.FC<PerformancePageClientProps> = ({
  performanceGrouped,
}) => {
  const { currentPeriod } = usePeriod();
  const [data] = useState<any[]>(performanceGrouped);

  const transformChartData = (
    performanceGrouped: any[],
    currentPeriod: string
  ) => {
    const groups = Array.from(
      new Set(performanceGrouped.map((item) => item.group))
    );

    return groups.map((group) => {
      const filteredData = performanceGrouped.filter(
        (item) => item.group === group
      );
      const chartData = filteredData
        .map((item) => {
          const value = item[`pct_chg_${currentPeriod}`] ?? null;
          return value !== null
            ? { label: item.name || item.code, value }
            : null;
        })
        .filter(
          (item): item is { label: string; value: number } => item !== null
        )
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

  const chartDataByGroup = transformChartData(data, currentPeriod);

  return (
    <div className="w-full flex flex-col space-y-4 overflow-hidden">
      <CompactSelector />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
        {chartDataByGroup.map(({ group, data }) => (
          <div
            key={group}
            className="rounded-lg p-2 bg-background shadow-md overflow-hidden"
          >
            <h3
              className="text-foreground text-sm font-semibold mb-1 truncate"
              title={group}
            >
              {group}
            </h3>
            {Object.keys(data).length > 0 ? (
              <div className="max-h-120 overflow-hidden">
                <PerformanceChart data={data} />
              </div>
            ) : (
              <p className="text-muted text-sm italic">No data available</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformancePageClient;
