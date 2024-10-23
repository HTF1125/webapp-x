import React from "react";

const TIME_RANGES = ["1M", "3M", "6M", "1Y", "3Y", "5Y", "ALL"] as const;
type TimeRange = (typeof TIME_RANGES)[number];

const TimeRangeSelector: React.FC<{
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}> = ({ timeRange, setTimeRange }) => (
  <div className="w-full sm:w-auto">
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Time Range:</p>
    <div className="flex flex-wrap gap-2">
      {TIME_RANGES.map((range) => (
        <button
          key={range}
          onClick={() => setTimeRange(range)}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            timeRange === range
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {range}
        </button>
      ))}
    </div>
  </div>
);

export default TimeRangeSelector;
