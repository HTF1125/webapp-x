// app/regimes/RegimeSelector.tsx
'use client';

import React, { useState } from 'react';
import { Regime } from './api';
import dynamic from 'next/dynamic';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const DynamicRegimeChart = dynamic(() => import('./RegimeChart'), {
  ssr: false,
  loading: () => <p>Loading Chart...</p>
});

export default function RegimeSelector({ regimes }: { regimes: Regime[] }) {
  const [selectedRegime, setSelectedRegime] = useState<Regime | null>(regimes[0] || null);
  const [startDate, setStartDate] = useState<Date>(new Date('2010-01-01'));

  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      setStartDate(date);
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center space-x-4">
        <div>
          <label htmlFor="regime-select" className="block text-sm font-medium mb-2 dark:text-gray-200">
            Select Regime:
          </label>
          <select
            id="regime-select"
            value={selectedRegime?.code || ""}
            onChange={(e) => {
              const regime = regimes.find(r => r.code === e.target.value);
              if (regime) setSelectedRegime(regime);
            }}
            className="w-full pl-3 pr-10 py-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            {regimes.map((regime) => (
              <option key={regime.code} value={regime.code}>
                {regime.code}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium mb-2 dark:text-gray-200">
            Start Date:
          </label>
          <DatePicker
            id="start-date"
            selected={startDate}
            onChange={handleStartDateChange}
            className="w-full pl-3 pr-10 py-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>
      </div>
      {selectedRegime && (
        <div className="mt-4">
          <DynamicRegimeChart data={selectedRegime.data} startDate={startDate} />
        </div>
      )}
    </>
  );
}
