"use client";

import React, { useState } from "react";
import PerformanceChart from "./PerformanceChart";
import { Period, PerformanceGrouped } from "./types";
import { ScrollShadow } from "@nextui-org/react";

interface PerformancePageProps {
  performanceGrouped: PerformanceGrouped[];
}

interface SelectorProps {
  current: string;
  options: string[];
  onSelect: (value: string) => void;
}

const CompactSelector: React.FC<SelectorProps> = ({
  current,
  options,
  onSelect,
}) => {
  return (
    <div className="flex flex-wrap gap-1 bg-gray-900 p-1 rounded-lg shadow-md overflow-auto">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className={`px-2 py-1 text-sm font-medium rounded-md transition-all duration-150 ease-in-out
            ${
              current === option
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export function PerformancePage({ performanceGrouped }: PerformancePageProps) {
  const [currentPeriod, setPeriod] = useState<Period>("1d");
  const [currentGroup, setGroup] = useState<string>("All");

  // Extract unique groups and add "All" option
  const groups = ["All", ...new Set(performanceGrouped.map((p) => p.group))];

  // Filter the data for the selected group
  const filteredData =
    currentGroup === "All"
      ? performanceGrouped
      : performanceGrouped.filter((item) => item.group === currentGroup);

  // Prepare chart data for the selected period
  const chartData = filteredData
    .map((item) => {
      const value =
        typeof item[`pct_chg_${currentPeriod}`] === "number"
          ? item[`pct_chg_${currentPeriod}`]
          : null; // Ensure invalid values are treated as null

      return value !== null
        ? {
            label: item.name || item.code,
            value,
          }
        : null; // Exclude entries with null values
    })
    .filter((item): item is { label: string; value: number } => item !== null) // Ensure filtered items are non-null
    .sort((a, b) => b.value - a.value); // Sort by value descending

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
        {/* Period Selector */}
        <CompactSelector
          current={currentPeriod}
          options={["1d", "1w", "1m", "3m", "6m", "1y", "3y", "mtd", "ytd"]}
          onSelect={(value) => setPeriod(value as Period)}
        />

        {/* Group Selector */}
        <CompactSelector
          current={currentGroup}
          options={groups}
          onSelect={setGroup}
        />

        {/* Chart Section */}
        <ScrollShadow
          hideScrollBar
          orientation="horizontal"
          className="max-h-[400px] rounded-lg shadow-md bg-gray-900"
        >
          {chartData.length > 0 ? (
            <div
              style={{
                height: 400,
                width: "100%",
                position: "relative",
              }}
            >
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
}
