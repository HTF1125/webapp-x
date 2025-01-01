"use client";

import React, { useState } from "react";
import PerformanceChart from "./PerformanceChart";
import { Period, PerformanceGrouped } from "./types";
import CompactSelector from "./CompactSelector";

type PageProps = {
  performanceGrouped: PerformanceGrouped[];
};

const ClientPerformancePage: React.FC<PageProps> = ({ performanceGrouped }) => {
  const [currentPeriod, setPeriod] = useState<Period>("ytd");

  const groups = [...new Set(performanceGrouped.map((p) => p.group))];

  const chartDataByGroup = groups.map((group) => {
    const filteredData = performanceGrouped.filter((item) => item.group === group);

    const chartData = filteredData
      .map((item) => {
        const value =
          typeof item[`pct_chg_${currentPeriod}`] === "number"
            ? item[`pct_chg_${currentPeriod}`]
            : null;

        return value !== null
          ? {
              label: item.name || item.code,
              value,
            }
          : null;
      })
      .filter((item): item is { label: string; value: number } => item !== null)
      .sort((a, b) => b.value - a.value);

    const chartDataFormatted = chartData.reduce<Record<string, number>>(
      (acc, item) => {
        acc[item.label] = item.value;
        return acc;
      },
      {}
    );

    return { group, data: chartDataFormatted };
  });

  return (
    <div className="w-full max-h-[600px] flex flex-col">
      <CompactSelector
        current={currentPeriod}
        options={["1d", "1w", "1m", "3m", "6m", "1y", "3y", "mtd", "ytd"]}
        onSelect={(value) => setPeriod(value as Period)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mt-2">
        {chartDataByGroup.map(({ group, data }) => (
          <div key={group} className=" rounded p-2 text-center">
            <h3 className="text-white text-xs font-bold mb-1 truncate">
              {group}
            </h3>
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

export default ClientPerformancePage;
