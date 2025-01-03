"use client";

import React from "react";
import PerformanceChart from "@/components/chart/PerformanceChart";
import { IndexGroupPeriodPerformances, Period, PeriodPerformance } from "@/app/api/all";

interface MarketChartsProps {
  allIndexGroupPerformances: IndexGroupPeriodPerformances;
  currentPeriod: Period; // Accept currentPeriod as a prop
}

const MarketCharts: React.FC<MarketChartsProps> = ({
  allIndexGroupPerformances,
  currentPeriod,
}) => {
  // Helper function to process chart data for a single group
  const getChartData = (performances: PeriodPerformance[]) => {
    const chartArray = performances
      .map((item) => ({
        label: item.code,
        value: item[
          `pct_chg_${currentPeriod}` as keyof PeriodPerformance
        ] as number,
      }))
      .filter((item) => item.value !== null && item.value !== undefined)
      .sort((a, b) => b.value - a.value);

    // Convert array to Record<string, number>
    const chartData = chartArray.reduce<Record<string, number>>((acc, item) => {
      acc[item.label] = item.value;
      return acc;
    }, {});

    return chartData;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {Object.entries(allIndexGroupPerformances).map(
        ([indexGroup, periodPerformances]) => {
          const chartData = getChartData(
            periodPerformances as PeriodPerformance[]
          );
          return (
            <div
              key={indexGroup}
              className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700"
            >
              {Object.keys(chartData).length > 0 ? (
                <>
                  <h3 className="text-sm font-semibold mb-3 text-center text-gray-200">
                    {indexGroup}
                  </h3>
                  <div
                    style={{
                      height: 200,
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    <PerformanceChart data={chartData} />
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-400">No data available</p>
              )}
            </div>
          );
        }
      )}
    </div>
  );
};

export default MarketCharts;
