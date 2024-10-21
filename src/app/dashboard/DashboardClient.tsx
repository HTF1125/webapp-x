// app/dashboard/DashboardClient.tsx

'use client';

import React from 'react';
import PerformanceTable from './PerformanceTable';
import { TableData } from './types';

interface DashboardClientProps {
  initialTables: TableData[];
}

const DashboardClient: React.FC<DashboardClientProps> = React.memo(({ initialTables }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Performance Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {initialTables.map((table) => (
          <div key={table.title} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <PerformanceTable {...table} />
          </div>
        ))}
      </div>
    </div>
  );
});

DashboardClient.displayName = 'DashboardClient';

export default DashboardClient;
