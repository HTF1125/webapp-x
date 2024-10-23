// src/app/dashboard/page.tsximport React, { Suspense } from 'react';
import { fetchPeriodPerformances } from "./api";
import { TableData, tableGroups } from "./types";
import { Suspense } from "react";
import DashboardClient from "./DashboardClient";
import PeriodSelector from "./PeriodSelector";
import PerformanceCharts from "./PerformanceCharts";
import LoadingSpinner from "@/components/LoadingSpinner";

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

export default async function DashboardPage() {
  const tables = await fetchAllPerformanceData();

  return (
    <div className="min-h-screen">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
        </header>

        <main>
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <Suspense fallback={<LoadingSpinner />}>
                <PeriodSelector />
              </Suspense>
            </div>
            <Suspense fallback={<LoadingSpinner />}>
              <PerformanceCharts data={tables} />
            </Suspense>
          </section>

          <section>
            <Suspense fallback={<LoadingSpinner />}>
              <DashboardClient initialTables={tables} />
            </Suspense>
          </section>
        </main>
      </div>
    </div>
  );
}
