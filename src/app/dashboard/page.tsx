// src/app/dashboard/page.tsximport React, { Suspense } from 'react';
import { fetchPeriodPerformances } from "./api";
import { TableData, tableGroups } from "./types";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const DashboardClient = dynamic(() => import("./DashboardClient"), {
  ssr: false,
});
const PeriodSelector = dynamic(() => import("./PeriodSelector"), {
  ssr: false,
});
const PerformanceCharts = dynamic(() => import("./PerformanceCharts"), {
  ssr: false,
});
const LoadingSpinner = dynamic(
  () => import("@/components/LoadingSpinner"),
  { ssr: false }
);

async function fetchAllPerformanceData(): Promise<TableData[]> {
  try {
    const results = await Promise.all(
      tableGroups.map(async (group) => ({
        data: await fetchPeriodPerformances({ group: group.group,  }),
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
        </header>

        <main>
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Key Performance
              </h2>
              <Suspense fallback={<LoadingSpinner />}>
                <PeriodSelector />
              </Suspense>
            </div>
            <Suspense fallback={<LoadingSpinner />}>
              <PerformanceCharts data={tables} />
            </Suspense>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
              Performance
            </h2>
            <Suspense fallback={<LoadingSpinner />}>
              <DashboardClient initialTables={tables} />
            </Suspense>
          </section>
        </main>
      </div>
    </div>
  );
}
