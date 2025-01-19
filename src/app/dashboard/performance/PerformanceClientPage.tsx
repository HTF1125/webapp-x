"use client";

import React, { useState } from "react";
import { usePeriod } from "./PeriodProvider";
import CompactSelector from "./CompactSelector";
import PerformanceChart from "./PerformanceChart";
import PerformanceTable from "./PerformanceTable";

interface PerformanceDataItem {
  group: string;
  code?: string;
  name?: string;
  pct_chg_1d?: number;
  pct_chg_1w?: number;
  pct_chg_1m?: number;
  pct_chg_3m?: number;
  pct_chg_6m?: number;
  pct_chg_1y?: number;
  pct_chg_mtd?: number;
  pct_chg_ytd?: number;
}

interface PerformancePageClientProps {
  performanceGrouped: any[];
}

const PerformancePageClient: React.FC<PerformancePageClientProps> = ({
  performanceGrouped,
}) => {
  const { currentPeriod } = usePeriod();
  const [data] = useState<any[]>(performanceGrouped);
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

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

  const groupedData: Record<string, PerformanceDataItem[]> = data.reduce(
    (acc, item) => {
      if (!acc[item.group]) {
        acc[item.group] = [];
      }
      acc[item.group].push(item);
      return acc;
    },
    {} as Record<string, PerformanceDataItem[]>
  );
  

  return (
    <div className="w-full  flex flex-col space-y-1 overflow-hidden">
      <CompactSelector />
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setViewMode('chart')}
          className={`px-3 py-1 mr-2 rounded ${viewMode === 'chart' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Chart
        </button>
        <button
          onClick={() => setViewMode('table')}
          className={`px-3 py-1 rounded ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Table
        </button>
      </div>
      {viewMode === 'chart' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {chartDataByGroup.map(({ group, data }) => (
            <div
              key={group}
              className="rounded-lg p-1 bg-background"
            >
              <h3
                className="text-foreground text-sm font-semibold truncate"
                title={group}
              >
                {group}
              </h3>
              {Object.keys(data).length > 0 ? (
                <div className="overflow-hidden">
                  <PerformanceChart data={data} />
                </div>
              ) : (
                <p className="text-muted text-sm italic">No data available</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-2">
          {Object.entries(groupedData).map(([group, groupData]) => (
            <PerformanceTable key={group} data={groupData} group={group} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PerformancePageClient;
