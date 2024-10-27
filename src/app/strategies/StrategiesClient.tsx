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
    let sorted = strategies.filter((strategy) =>
      strategy.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    sorted.sort((a, b) => {
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

    return sorted;
  }, [strategies, searchTerm, sortConfig]);

  const handleSort = (field: SortField) => {
    setSortConfig((prevConfig) => ({
      field,
      order:
        prevConfig.field === field && prevConfig.order === "asc" ? "desc" : "asc",
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
    <div className="w-full p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
      {loading && <div className="loading-spinner">Loading...</div>}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
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

        <Button
          onClick={() => handleSort("code")}
          variant="outline"
          className={`w-full md:w-auto border border-gray-300 dark:border-gray-700 rounded-md flex items-center justify-center ${
            sortConfig.field === "code" ? "bg-blue-100 dark:bg-blue-800" : ""
          }`}
        >
          Code {renderSortIcon("code")}
        </Button>

        <Button
          onClick={() => handleSort("ann_return")}
          variant="outline"
          className={`w-full md:w-auto border border-gray-300 dark:border-gray-700 rounded-md flex items-center justify-center ${
            sortConfig.field === "ann_return" ? "bg-blue-100 dark:bg-blue-800" : ""
          }`}
        >
          Return {renderSortIcon("ann_return")}
        </Button>

        <Button
          onClick={() => handleSort("ann_volatility")}
          variant="outline"
          className={`w-full md:w-auto border border-gray-300 dark:border-gray-700 rounded-md flex items-center justify-center ${
            sortConfig.field === "ann_volatility" ? "bg-blue-100 dark:bg-blue-800" : ""
          }`}
        >
          Volatility {renderSortIcon("ann_volatility")}
        </Button>
      </div>

      {/* Strategy Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedStrategies.map((strategy) => (
          <div
            key={strategy.code}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-transform transform hover:scale-105 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => handleStrategyClick(strategy._id)}
          >
            <h3 className="text-lg font-semibold text-black dark:text-white">{strategy.code}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last Updated: {formatDate(strategy.last_updated)}
            </p>
            <p className={`text-lg font-medium ${strategy.ann_return > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              Annual Return: {formatPercentage(strategy.ann_return)}
            </p>
            <p className={`text-lg font-medium ${strategy.ann_volatility > 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
              Annual Volatility: {formatPercentage(strategy.ann_volatility)}
            </p>
            <MiniNavChart data={strategy.nav_history} />
          </div>
        ))}
      </div>
    </div>
  );
}
