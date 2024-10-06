"use client";

import React, { useState, useEffect } from "react";
import { fetchRegimes, Regime } from "@/lib/api/regime";
import dynamic from 'next/dynamic';

// Dynamically import RegimeChart component
const DynamicRegimeChart = dynamic(() => import('@/components/RegimeChart'), {
  ssr: false,
  loading: () => <p>Loading Chart...</p>
});

// Regime selection component
function RegimeSelector({ regimes, selectedRegime, onRegimeChange }: {
  regimes: Regime[],
  selectedRegime: Regime | null,
  onRegimeChange: (regime: Regime) => void
}) {
  return (
    <div className="mb-4">
      <label htmlFor="regime-select" className="block text-sm font-medium mb-2 dark:text-gray-200">
        Select Regime:
      </label>
      <select
        id="regime-select"
        value={selectedRegime?.code || ""}
        onChange={(e) => {
          const regime = regimes.find(r => r.code === e.target.value);
          if (regime) onRegimeChange(regime);
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
  );
}

// Main page component
export default function RegimesPage() {
  const [regimes, setRegimes] = useState<Regime[]>([]);
  const [selectedRegime, setSelectedRegime] = useState<Regime | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRegimes()
      .then((data) => {
        setRegimes(data);
        if (data.length > 0) {
          setSelectedRegime(data[0]); // Set the first regime as default
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching regime data:", error);
        setError("Failed to fetch regime data");
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div className="w-full p-4 dark:bg-gray-900 dark:text-gray-200">Loading...</div>;
  if (error) return <div className="w-full p-4 dark:bg-gray-900 text-red-600 dark:text-red-400">Error: {error}</div>;
  if (regimes.length === 0) return <div className="w-full p-4 dark:bg-gray-900 dark:text-gray-200">No regime data available</div>;

  return (
    <div className="w-full p-4 dark:bg-gray-900">
      <div className="w-[90%] mx-auto">
        <h1 className="text-2xl font-bold mb-4 dark:text-gray-200">Regimes</h1>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <RegimeSelector
            regimes={regimes}
            selectedRegime={selectedRegime}
            onRegimeChange={setSelectedRegime}
          />
          {selectedRegime && (
            <div className="mt-4">
              <DynamicRegimeChart data={selectedRegime.data} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}