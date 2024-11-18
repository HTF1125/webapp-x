"use client";

import React from "react";
import { TableData, KeyPerformance } from "@/components/dashboard/types";
import BarChart from "@/components/chart/BarChart";
import { usePeriod } from "@/components/dashboard/PeriodContext";

const MarketCharts: React.FC<{ tables: TableData[] }> = ({ tables }) => {
  const { currentPeriod } = usePeriod();

  // Function to process chart data for a single table
  const getChartData = (tableData: TableData) => {
    return tableData.data
      .map((item) => ({
        label: item.code,
        value: item[`pct_chg_${currentPeriod}` as keyof KeyPerformance] as number,
      }))
      .filter((item) => item.value !== null && item.value !== undefined)
      .sort((a, b) => b.value - a.value)
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {tables.map((tableData) => {
        const chartData = getChartData(tableData);
        return <BarChart key={tableData.title} title={tableData.title} data={chartData} />;
      })}
    </div>
  );
};

export default MarketCharts;
