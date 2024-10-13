'use client';

import { formatDate, formatPercentage } from "@/lib/fmt";
import { StrategySummary } from './types';
import MiniNavChart from './MiniNavChart';

interface StrategyCardProps {
  strategy: StrategySummary;
  onClick: () => void; // New prop for handling click events
}

export default function StrategyCard({ strategy, onClick }: StrategyCardProps) {
  if (!strategy) {
    return <div>No strategy data available</div>;
  }

  return (
    <div
      className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden transition-all duration-300 ease-in-out mb-8 cursor-pointer"
      onClick={onClick} // Call the onClick prop when the card is clicked
    >
      <div className="p-4">
        <h2 className="text-xl font-semibold dark:text-white mb-4">{strategy.code}</h2>
        <div className="h-24 mb-4">
          <MiniNavChart data={strategy.nav_history} />
        </div>
        {/* Badges moved outside */}
        <div className="flex justify-between items-center mt-4">
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            Updated: {formatDate(strategy.last_updated)}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            strategy.ann_return && strategy.ann_return > 0
              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
              : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
          }`}>
            Return: {formatPercentage(strategy.ann_return)}
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
            Risk: {formatPercentage(strategy.ann_volatility)}
          </span>
        </div>
      </div>
    </div>
  );
}
