import React from "react";
import { formatDate, formatPercentage } from "@/lib/fmt";
import MiniLineChart from "@/components/chart/MiniLineChart";

interface StrategyCardProps {
  strategy: {
    _id: string;
    code: string;
    last_updated: string;
    ann_return: number;
    ann_volatility: number;
    nav_history: number[];
  };
  onClick: (strategyId: string) => void;
}

const StrategyCard: React.FC<StrategyCardProps> = ({ strategy, onClick }) => {
  return (
    <div
      key={strategy.code}
      className="bg-transparent p-4 border border-white rounded-lg shadow-sm transition-transform transform hover:scale-105 cursor-pointer"
      onClick={() => onClick(strategy._id)}
    >
      <h3 className="text-sm font-semibold text-center text-white mb-3">
        {strategy.code}
      </h3>
      <div className="flex justify-center items-center gap-2 mb-2">
        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
          Updated: {formatDate(strategy.last_updated)}
        </span>
      </div>
      <div className="flex justify-center items-center gap-2 mb-2">
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            strategy.ann_return > 0
              ? "bg-green-800 text-green-400"
              : "bg-red-800 text-red-400"
          }`}
        >
          Return: {formatPercentage(strategy.ann_return)}
        </span>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            strategy.ann_volatility > 0
              ? "bg-yellow-800 text-yellow-400"
              : "bg-red-800 text-red-400"
          }`}
        >
          Volatility: {formatPercentage(strategy.ann_volatility)}
        </span>
      </div>
      <MiniLineChart data={strategy.nav_history} />
    </div>
  );
};

export default StrategyCard;
