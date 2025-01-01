"use client";

import React, { useState } from "react";
import PerformanceChart from "./PerformanceChart";
import { Period, PerformanceGrouped } from "./types";
import { ScrollShadow } from "@nextui-org/react";
import CompactSelector from "./CompactSelector";

type PageProps = {
  performanceGrouped: PerformanceGrouped[];
};

const ClientPerformancePage: React.FC<PageProps> = ({ performanceGrouped }) => {
  const [currentPeriod, setPeriod] = useState<Period>("1d");
  const [currentGroup, setGroup] = useState<string>("All");

  const groups = ["All", ...new Set(performanceGrouped.map((p) => p.group))];

  const filteredData =
    currentGroup === "All"
      ? performanceGrouped
      : performanceGrouped.filter((item) => item.group === currentGroup);

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

  return (
    <div className="w-full max-h-[800px] flex flex-col space-y-6">
      <div className="space-y-4">
        <CompactSelector
          current={currentPeriod}
          options={["1d", "1w", "1m", "3m", "6m", "1y", "3y", "mtd", "ytd"]}
          onSelect={(value) => setPeriod(value as Period)}
        />
        <CompactSelector
          current={currentGroup}
          options={groups}
          onSelect={setGroup}
        />
        <ScrollShadow
          hideScrollBar
          orientation="horizontal"
          className="max-h-[400px] rounded-lg shadow-md bg-gray-900"
        >
          {chartData.length > 0 ? (
            <div style={{ height: 400, width: "100%", position: "relative" }}>
              <PerformanceChart data={chartDataFormatted} />
            </div>
          ) : (
            <div className="text-center text-gray-400 py-10">
              No data available for the selected group.
            </div>
          )}
        </ScrollShadow>
      </div>
    </div>
  );
};

export default ClientPerformancePage;
