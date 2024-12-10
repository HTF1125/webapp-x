"use client";

import React from "react";

interface PeriodSelectorProps {
  selectedPeriod: string;
  periods: string[];
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selectedPeriod,
  periods,
}) => {
  const handlePeriodChange = (period: string) => {
    // Navigate or update state using a URL query parameter
    window.location.href = `?period=${period}`;
  };

  return (
    <div className="flex flex-wrap justify-center sm:justify-start gap-2 bg-gray-800 p-2 rounded-lg shadow-md border border-gray-700">
      {periods.map((period) => (
        <button
          key={period}
          onClick={() => handlePeriodChange(period)}
          aria-pressed={selectedPeriod === period}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-150 ease-in-out
            ${
              selectedPeriod === period
                ? "text-white bg-gray-700 border border-gray-500 shadow-inner" // Active button styles
                : "text-gray-400 bg-gray-800 hover:text-white hover:bg-gray-700 border border-transparent" // Inactive button styles
            }`}
        >
          {period.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default PeriodSelector;
