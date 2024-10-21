// app/dashboard/PeriodSelector.tsx
"use client";

import React, { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { periods, Period } from "./types";

const PeriodSelector: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPeriod = (searchParams.get("period") as Period) || "1w";

  const handlePeriodChange = useCallback(
    (newPeriod: Period) => {
      router.push(`?period=${newPeriod}`);
    },
    [router]
  );

  return (
    <div className="flex space-x-2 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm">
      {periods.map((period) => (
        <button
          key={period}
          onClick={() => handlePeriodChange(period)}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out
            ${
              currentPeriod === period
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            }`}
        >
          {period.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default React.memo(PeriodSelector);
