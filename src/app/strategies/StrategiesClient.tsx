"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { StrategiesKeyInfo } from "./types";
import { Input } from "@/components/ui/input";
import { formatDate, formatPercentage } from "@/lib/helper";
import { Search } from "lucide-react";
import MiniLineChart from "@/components/chart/MiniLineChart";

interface StrategiesClientProps {
  initialStrategies: StrategiesKeyInfo[];
}

type SortField = "code" | "ann_return" | "ann_volatility";
type SortOrder = "asc" | "desc";

export default function StrategiesClient({
  initialStrategies,
}: StrategiesClientProps) {
  const [strategies] = useState<StrategiesKeyInfo[]>(initialStrategies);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig] = useState<{
    field: SortField;
    order: SortOrder;
  }>({
    field: "code",
    order: "asc",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const filteredAndSortedStrategies = useMemo(() => {
    const filtered = strategies.filter((strategy) =>
      strategy.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortConfig.field === "code") {
        return sortConfig.order === "asc"
          ? a.code.localeCompare(b.code)
          : b.code.localeCompare(a.code);
      } else {
        const aValue = a[sortConfig.field] ?? 0;
        const bValue = b[sortConfig.field] ?? 0;
        return sortConfig.order === "asc"
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });
  }, [strategies, searchTerm, sortConfig]);

  const handleStrategyClick = async (strategyId: string) => {
    setLoading(true);
    await router.push(`/strategies/${strategyId}`);
    setLoading(false);
  };

  return (
    <div className="w-full p-4">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg">
            <p className="text-lg font-semibold text-white">Loading...</p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Search strategies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300"
            size={20}
          />
        </div>
      </div>

      {/* Strategies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredAndSortedStrategies.map((strategy) => (
          <div
            key={strategy.code}
            className="bg-transparent p-4 border border-white rounded-lg shadow-sm transition-transform transform hover:scale-105 cursor-pointer"
            onClick={() => handleStrategyClick(strategy.code)}
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
        ))}
      </div>
    </div>
  );
}
