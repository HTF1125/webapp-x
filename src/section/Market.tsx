import React, { Suspense } from "react";
import { fetchPeriodPerformances } from "@/components/dashboard/api";
import { TableData, tableGroups } from "@/components/dashboard/types";
import PeriodSelector from "@/components/dashboard/PeriodSelector";
import MarketCharts from "@/components/MarketCharts";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { PeriodProvider } from "@/components/dashboard/PeriodContext";
import Section from "@/components/Section";

async function fetchAllPerformanceData(): Promise<TableData[]> {
  try {
    const results = await Promise.all(
      tableGroups.map(async (group) => ({
        data: await fetchPeriodPerformances({ group: group.group }),
        title: group.title,
      }))
    );
    return results;
  } catch (error) {
    console.error("Error fetching performance data:", error);
    return [];
  }
}

export default async function MarketSection() {
  const tables = await fetchAllPerformanceData();

  return (
    <PeriodProvider>
      <Section header="Market">
        <div className="flex justify-between items-center mb-4">
          <Suspense fallback={<LoadingSpinner />}>
            <PeriodSelector />
          </Suspense>
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          <MarketCharts tables={tables} />
        </Suspense>
      </Section>
    </PeriodProvider>
  );
}
