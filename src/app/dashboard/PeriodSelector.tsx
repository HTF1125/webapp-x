// app/dashboard/PeriodSelector.tsx

'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { periods, Period } from './types';

const PeriodSelector: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPeriod = (searchParams.get('period') as Period) || '1w';

  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPeriod = event.target.value as Period;
    router.push(`?period=${newPeriod}`);
  };

  return (
    <select
      value={currentPeriod}
      onChange={handlePeriodChange}
      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 text-sm text-gray-700 dark:text-gray-200"
    >
      {periods.map((period) => (
        <option key={period} value={period}>
          {period.toUpperCase()}
        </option>
      ))}
    </select>
  );
};

export default PeriodSelector;
