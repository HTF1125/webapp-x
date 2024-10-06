// app/dashboard/page.tsx

import { format } from "date-fns";
import DashboardClient from "./client";
import { fetchPeriodPerformances, PeriodPerformances } from "./api";

interface TableData {
  data: PeriodPerformances[];
  title: string;
}

async function fetchAllPerformanceData(date: string): Promise<TableData[]> {
  const tableGroups = [
    { group: "local-indices", title: "Local Indices" },
    { group: "global-markets", title: "Global Markets" },
    { group: "us-gics", title: "US GICS" },
    { group: "global-bonds", title: "Global Bonds" },
    { group: "currency", title: "Currency" },
    { group: "commodities", title: "Commodities" },
    { group: "theme", title: "Theme" },
  ];

  const results = await Promise.all(
    tableGroups.map((group) => fetchPeriodPerformances(date, group.group))
  );

  return results.map((data, index) => ({
    data,
    title: tableGroups[index].title,
  }));
}

export default async function DashboardPage() {
  const currentDate = new Date();
  const formattedDate = format(currentDate, "yyyy-MM-dd");

  let tables: TableData[] = [];
  let error: string | null = null;

  try {
    tables = await fetchAllPerformanceData(formattedDate);
  } catch (e) {
    console.error("Error fetching performance data:", e);
    error = e instanceof Error ? e.message : "An unknown error occurred";
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold text-red-600">
        Error: {error}
      </div>
    );
  }

  return <DashboardClient initialTables={tables} initialDate={currentDate} />;
}
