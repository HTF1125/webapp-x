"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Strategy } from "./types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDate, formatPercentage } from "@/lib/fmt";
import { Search, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import MiniNavChart from "@/components/MiniNavChart";

interface StrategiesClientProps {
  initialStrategies: Strategy[];
}

type SortField = "code" | "ann_return" | "ann_volatility";
type SortOrder = "asc" | "desc";

export default function StrategiesClient({ initialStrategies }: StrategiesClientProps) {
  const [strategies] = useState<Strategy[]>(initialStrategies);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ field: SortField; order: SortOrder }>({
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

  const handleSort = (field: SortField) => {
    setSortConfig((prevConfig) => ({
      field,
      order: prevConfig.field === field && prevConfig.order === "asc" ? "desc" : "asc",
    }));
  };

  const handleStrategyClick = async (strategyId: string) => {
    setLoading(true);
    await router.push(`/strategies/${strategyId}`);
    setLoading(false);
  };

  const renderSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortConfig.order === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg">
            <p className="text-lg font-semibold text-black dark:text-white">Loading...</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search strategies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" size={20} />
        </div>

        <div className="flex flex-wrap gap-2">
          {["code", "ann_return", "ann_volatility"].map((field) => (
            <Button
              key={field}
              onClick={() => handleSort(field as SortField)}
              variant="outline"
              className={`flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 transition-colors duration-200 ${
                sortConfig.field === field ? "bg-blue-100 dark:bg-blue-800" : ""
              }`}
            >
              {field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')} {renderSortIcon(field as SortField)}
            </Button>
          ))}
        </div>
      </div>

      {/* Strategy Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedStrategies.map((strategy) => (
          <div
            key={strategy.code}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 transition-transform transform hover:scale-105 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700"
            onClick={() => handleStrategyClick(strategy._id)}
          >
            <h3 className="text-md font-semibold text-black dark:text-white">{strategy.code}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Last Updated: {formatDate(strategy.last_updated)}</p>
            <p className={`text-md font-medium ${strategy.ann_return > 0 ? 'text-green-600' : 'text-red-600'}`}>
              Annual Return: {formatPercentage(strategy.ann_return)}
            </p>
            <p className={`text-md font-medium ${strategy.ann_volatility > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
              Annual Volatility: {formatPercentage(strategy.ann_volatility)}
            </p>
            <MiniNavChart data={strategy.nav_history} />
          </div>
        ))}
      </div>
    </div>
  );
}
