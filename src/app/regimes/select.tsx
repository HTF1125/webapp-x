// components/RegimeSelector.tsx

'use client';

import React, { useState } from 'react';
import { Regime } from './api';
import dynamic from 'next/dynamic';

const DynamicRegimeChart = dynamic(() => import('./RegimeChart'), {
  ssr: false,
  loading: () => <p>Loading Chart...</p>
});

export default function RegimeSelector({ regimes }: { regimes: Regime[] }) {
  const [selectedRegime, setSelectedRegime] = useState<Regime | null>(regimes[0] || null);

  return (
    <>
      <div className="mb-4">
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
      {selectedRegime && (
        <div className="mt-4">
          <DynamicRegimeChart data={selectedRegime.data} />
        </div>
      )}
    </>
  );
}