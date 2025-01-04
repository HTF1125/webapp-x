import React from "react";
import { usePeriod } from "./PeriodProvider";
import { Period } from "./DataServices"; // Assuming the Period type is exported from a `types` file

const CompactSelector: React.FC = () => {
  const { currentPeriod, setCurrentPeriod } = usePeriod();

  // Define available period options using the Period type
  const periodOptions: Period[] = [
    "1d",
    "1w",
    "1m",
    "3m",
    "6m",
    "1y",
    "3y",
    "mtd",
    "ytd",
  ];

  return (
    <div
      className="inline-flex flex-wrap gap-2 p-2 rounded-lg shadow-lg bg-gray-800"
      role="group"
      aria-label="Period Selector"
    >
      {periodOptions.map((option) => (
        <button
          key={option}
          onClick={() => setCurrentPeriod(option)}
          className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-sm transition-all duration-200 ease-in-out ${
            currentPeriod === option
              ? "bg-blue-500 text-white shadow-md ring-2 ring-blue-400 ring-opacity-50"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
          }`}
          aria-pressed={currentPeriod === option}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default CompactSelector;
