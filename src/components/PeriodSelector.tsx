"use client";

import React from "react";

interface PeriodSelectorProps {
  selectedPeriod: string;
  periods: string[];
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ selectedPeriod, periods }) => {
  const handlePeriodChange = (period: string) => {
    // Navigate or update state using a URL query parameter
    window.location.href = `?period=${period}`;
  };

  return (
    <div className="flex space-x-2 bg-transparent p-1 rounded-lg">
      {periods.map((period) => (
        <button
          key={period}
          onClick={() => handlePeriodChange(period)}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ease-in-out
            ${
              selectedPeriod === period
                ? "text-white border border-white" // Active button styles
                : "text-gray-400 hover:text-white hover:border-white" // Inactive button styles
            }`}
        >
          {period.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default PeriodSelector;
