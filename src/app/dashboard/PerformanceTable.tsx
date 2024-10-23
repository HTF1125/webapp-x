// app/dashboard/PerformanceTable.tsx
'use client';

import React from 'react';
import { KeyPerformance, TableData, periods } from './types';
import { ArrowUp, ArrowDown } from 'lucide-react';

const PerformanceTable: React.FC<TableData> = React.memo(({ data, title }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-600 sticky top-0">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Index</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Level</th>
              {periods.map((period) => (
                <th key={period} className="px-3 py-2 text-right text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  {period.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {data.map((item, index) => (
              <tr key={item.code} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : ''}>
                <td className="px-3 py-1.5 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{item.code}</div>
                </td>
                <td className="px-3 py-1.5 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                  {item.level.toFixed(2)}
                </td>
                {periods.map((period) => {
                  const value = item[`pct_chg_${period}` as keyof KeyPerformance];
                  const numericValue = typeof value === 'number' ? value : 0;
                  return (
                    <td key={period} className={`px-3 py-1.5 whitespace-nowrap text-right text-sm ${
                      numericValue >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {typeof value === 'number' ? value.toFixed(2) : 'N/A'}%
                      {numericValue >= 0 ? <ArrowUp className="inline h-3 w-3 ml-0.5" /> : <ArrowDown className="inline h-3 w-3 ml-0.5" />}
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
