"use client";

import React from "react";
import { periods } from "./types";
import { usePeriod } from "./PeriodContext";

const PeriodSelector: React.FC = () => {
  const { currentPeriod, setPeriod } = usePeriod();

  return (
    <div className="flex space-x-2 bg-transparent p-1 rounded-lg">
      {periods.map((period) => (
        <button
          key={period}
          onClick={() => setPeriod(period)}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ease-in-out
            ${
              currentPeriod === period
                ? "text-white border border-white" // White border and text for active button
                : "text-gray-400 hover:text-white hover:border-white" // Gray text, white on hover
            }`}
        >
          {period.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default React.memo(PeriodSelector);
