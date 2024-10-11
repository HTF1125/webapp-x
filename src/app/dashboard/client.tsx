// components/DashboardClient.tsx

'use client';

import React from "react";
import { format } from "date-fns";
import PerformanceTable from "./PerformanceTable";
import { PeriodPerformances } from "./api";

interface TableData {
  data: PeriodPerformances[];
  title: string;
}

interface DashboardClientProps {
  initialTables: TableData[];
  initialDate: Date;
}

export default function DashboardClient({ initialTables, initialDate }: DashboardClientProps) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200">Market Performance Dashboard</h1>
        <div className="mb-6 flex items-center justify-end bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <span className="text-sm text-gray-600 dark:text-gray-400">Last updated: {format(initialDate, "PPP")}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
          {initialTables.map((table, index) => (
            <PerformanceTable key={index} data={table.data} title={table.title} />
          ))}
        </div>
      </div>
    </div>
  );
}