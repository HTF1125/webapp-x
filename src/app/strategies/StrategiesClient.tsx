"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { StrategySummary, StrategyPerformance } from "./types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StrategyDetails from "./StrategyDetails";
import { formatDate, formatPercentage } from "@/lib/fmt";
import { Search, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import MiniNavChart from "@/components/MiniNavChart";

interface StrategiesClientProps {
  initialStrategies: StrategySummary[];
  performanceData: Record<string, StrategyPerformance>;
}

export default function StrategiesClient({
  initialStrategies,
  performanceData,
}: StrategiesClientProps) {
  const [strategies] = useState<StrategySummary[]>(initialStrategies);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("code");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const router = useRouter();

  const filteredAndSortedStrategies = useMemo(() => {
    return strategies
      .filter((strategy) =>
        strategy.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === "return") {
          comparison = (b.ann_return ?? 0) - (a.ann_return ?? 0);
        } else if (sortBy === "volatility") {
          comparison = (b.ann_volatility ?? 0) - (a.ann_volatility ?? 0);
        } else {
          comparison = a.code.localeCompare(b.code);
        }
        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [strategies, searchTerm, sortBy, sortOrder]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        Strategy Overview
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search strategies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="code">Code</SelectItem>
            <SelectItem value="return">Annual Return</SelectItem>
            <SelectItem value="volatility">Annual Volatility</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          variant="outline"
          className="w-full md:w-auto"
        >
          {sortOrder === "asc" ? "Ascending" : "Descending"}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
        <Button
          onClick={() => router.push("/strategies/compare")}
          className="w-full md:w-auto"
        >
          Compare Strategies
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedStrategies.map((strategy) => (
          <div
            key={strategy.code}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer transition-all duration-200 ${
              selectedStrategy === strategy.code
                ? "ring-2 ring-blue-500 shadow-lg transform scale-105"
                : "hover:shadow-lg hover:scale-102"
            }`}
            onClick={() =>
              setSelectedStrategy(
                strategy.code === selectedStrategy ? null : strategy.code
              )
            }
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {strategy.code}
              </h3>
              {selectedStrategy === strategy.code ? (
                <ChevronUp className="text-blue-500" size={20} />
              ) : (
                <ChevronDown className="text-gray-400" size={20} />
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Last updated: {formatDate(strategy.last_updated)}
            </p>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Annual Return
                </p>
                <p
                  className={`text-lg font-bold ${
                    strategy.ann_return && strategy.ann_return > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formatPercentage(strategy.ann_return)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Annual Volatility
                </p>
                <p className="text-lg font-bold text-yellow-600">
                  {formatPercentage(strategy.ann_volatility)}
                </p>
              </div>
            </div>
            <div className="w-full h-24">
              <MiniNavChart data={strategy.nav_history || []} />
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedStrategies.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No strategies found</p>
      )}

      {selectedStrategy && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Strategy Details: {selectedStrategy}
          </h2>
          <StrategyDetails
            performanceData={performanceData[selectedStrategy]}
          />
        </div>
      )}
    </div>
  );
}
