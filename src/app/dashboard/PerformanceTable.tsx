// app/dashboard/PerformanceTable.tsx
'use client';

import React from 'react';
import { KeyPerformance, TableData, periods } from './types';

const PerformanceTable: React.FC<TableData> = React.memo(({ data, title }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden text-xs w-full">
      <h3 className="text-sm font-semibold p-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-b dark:border-gray-600">
        {title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-600">
              <th className="p-1 text-left w-1/6">Index</th>
              <th className="p-1 text-right w-1/12">Level</th>
              {periods.map((period) => (
                <th key={period} className="p-1 text-right w-1/12">{period.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.code} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : ''}>
                <td className="p-1 font-medium truncate" title={item.code}>{item.code}</td>
                <td className="p-1 text-right">{item.level.toFixed(2)}</td>
                {periods.map((period) => {
                  const value = item[`pct_chg_${period}` as keyof KeyPerformance];
                  const numericValue = typeof value === 'number' ? value : 0;
                  return (
                    <td
                      key={period}
                      className={`p-1 text-right ${
                        numericValue >= 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {typeof value === 'number' ? value.toFixed(2) : 'N/A'}%
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

PerformanceTable.displayName = 'PerformanceTable';

export default PerformanceTable;
