import React from "react";
import { usePeriod } from "./PeriodProvider";
import { Period } from "@/services/perfApi";


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
      className="inline-flex flex-wrap gap-1 p-1 rounded-lg shadow-lg bg-background"
      role="group"
      aria-label="Period Selector"
    >
      {periodOptions.map((option) => (
        <button
          key={option}
          onClick={() => setCurrentPeriod(option)}
          className={`px-3 py-1 text-xs sm:text-sm font-semibold rounded-sm transition-all duration-200 ease-in-out ${
            currentPeriod === option
              ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary ring-opacity-50"
              : "bg-muted text-muted-foreground hover:bg-muted-hover hover:text-foreground"
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
