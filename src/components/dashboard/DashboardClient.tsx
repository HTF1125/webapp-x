// app/dashboard/DashboardClient.tsx

"use client";

import React from "react";
import PerformanceTable from "./PerformanceTable";
import { TableData } from "./types";

interface DashboardClientProps {
  initialTables: TableData[];
}

const DashboardClient: React.FC<DashboardClientProps> = React.memo(
  ({ initialTables }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {initialTables.map((table) => (
            <div
              key={table.title}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <PerformanceTable {...table} />
            </div>
          ))}
        </div>
    );
  }
);

DashboardClient.displayName = "DashboardClient";

export default DashboardClient;
