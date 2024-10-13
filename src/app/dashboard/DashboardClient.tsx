// app/dashboard/DashboardClient.tsx

'use client';

import React from 'react';
import PerformanceTable from './PerformanceTable';
import { TableData } from './types';

interface DashboardClientProps {
  initialTables: TableData[];
}

const DashboardClient: React.FC<DashboardClientProps> = ({ initialTables }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {initialTables.map((table) => (
        <PerformanceTable key={table.title} {...table} />
      ))}
    </div>
  );
};

export default DashboardClient;
