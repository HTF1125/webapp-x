"use client";

import React from "react";
import { usePeriod } from "@/components/dashboard/PeriodContext";
import PerformanceChart from "@/components/chart/PerformanceChart";
import { IndexGroupPeriodPerformances, PeriodPerformance } from "@/api/all";
const MarketCharts: React.FC<{
  allIndexGroupPerformances: IndexGroupPeriodPerformances;
}> = ({ allIndexGroupPerformances }) => {
  const { currentPeriod } = usePeriod();

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {Object.entries(allIndexGroupPerformances).map(
        ([indexGroup, periodPerformances]) => {
          const chartData = getChartData(
            periodPerformances as PeriodPerformance[]
          );
          return (
            <div
              key={indexGroup}
              className="bg-transparent p-2 text-center rounded-lg shadow-sm"
            >
              {Object.keys(chartData).length > 0 ? (
                <>
                  <h3 className="text-sm font-semibold mb-1 text-white">
                    {indexGroup}
                  </h3>
                  <div
                    style={{ height: 200, width: "100%", position: "relative" }}
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
