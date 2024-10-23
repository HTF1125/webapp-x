"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Strategy } from "./types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate, formatPercentage } from "@/lib/fmt";
import { Search, ArrowUpDown } from "lucide-react";
import MiniNavChart from "@/components/MiniNavChart";

interface StrategiesClientProps {
  initialStrategies: Strategy[];
}

export default function StrategiesClient({ initialStrategies }: StrategiesClientProps) {
  const [strategies] = useState<Strategy[]>(initialStrategies);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("code");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(false);
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

  const handleStrategyClick = async (strategyId: string) => {
    setLoading(true);
    await router.push(`/strategies/${strategyId}`);
    setLoading(false);
  };

  return (
    <div className="w-full p-4 bg-gray-100 rounded-lg shadow-md">
      {loading && <div className="loading-spinner">Loading...</div>}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search strategies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48 border border-gray-300 rounded-md">
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
          className="w-full md:w-auto border border-gray-300 rounded-md flex items-center justify-center"
        >
          {sortOrder === "asc" ? "Ascending" : "Descending"}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Strategy Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedStrategies.map((strategy) => (
          <div
            key={strategy.code}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-transform transform hover:scale-105 cursor-pointer"
            onClick={() => handleStrategyClick(strategy._id)}
          >
            <h3 className="text-lg font-semibold">{strategy.code}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last Updated: {formatDate(strategy.last_updated)}
            </p>
            <p className={`text-lg font-medium ${strategy.ann_return > 0 ? 'text-green-600' : 'text-red-600'}`}>
              Annual Return: {formatPercentage(strategy.ann_return)}
            </p>
            <p className={`text-lg font-medium ${strategy.ann_volatility > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
              Annual Volatility: {formatPercentage(strategy.ann_volatility)}
            </p>
            {/* MiniNavChart for displaying NAV history */}
            <MiniNavChart data={strategy.nav_history} />
          </div>
        ))}
      </div>
    </div>
  );
}
