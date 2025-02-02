"use client";

import React, { useState, useMemo } from "react";
import { usePeriod } from "./PeriodProvider";
import CompactSelector from "./CompactSelector";
import PerformanceChart from "./PerformanceChart";
import PerformanceTable from "./PerformanceTable";
import { PerformanceGrouped } from "@/services/perfApi";

interface PerformancePageClientProps {
  performanceGrouped: PerformanceGrouped[];
}

const PerformancePageClient: React.FC<PerformancePageClientProps> = ({
  performanceGrouped,
}) => {
  const { currentPeriod } = usePeriod();

  const data = useMemo(() =>
    performanceGrouped.map((item) => ({
      ...item,
      pct_chg_1d: item.pct_chg_1d ?? 0,
      pct_chg_1w: item.pct_chg_1w ?? 0,
      pct_chg_1m: item.pct_chg_1m ?? 0,
      pct_chg_3m: item.pct_chg_3m ?? 0,
      pct_chg_6m: item.pct_chg_6m ?? 0,
      pct_chg_1y: item.pct_chg_1y ?? 0,
      pct_chg_mtd: item.pct_chg_mtd ?? 0,
      pct_chg_ytd: item.pct_chg_ytd ?? 0,
    })),
  [performanceGrouped]);

  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  const transformChartData = useMemo(() => {
    const groups = Array.from(new Set(data.map((item) => item.group)));

    return groups.map((group) => {
      const filteredData = data.filter((item) => item.group === group);
      const chartData = filteredData
        .map((item) => {
          const value = item[`pct_chg_${currentPeriod}` as keyof PerformanceGrouped];
          return { label: item.name || item.code, value: value as number };
        })
        .sort((a, b) => b.value - a.value);

      const formattedData = Object.fromEntries(
        chartData.map(({ label, value }) => [label, value])
      );

      return { group, data: formattedData };
    });
  }, [data, currentPeriod]);

  const groupedData = useMemo(() =>
    data.reduce<Record<string, PerformanceGrouped[]>>((acc, item) => {
      (acc[item.group] = acc[item.group] || []).push(item);
      return acc;
    }, {}),
  [data]);

  return (
    <div className="w-full flex flex-col space-y-1 overflow-hidden">
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
          {transformChartData.map(({ group, data }) => (
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
