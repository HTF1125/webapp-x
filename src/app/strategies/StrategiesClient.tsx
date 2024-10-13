// app/strategies/StrategiesClient.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { StrategySummary, StrategyPerformance } from './types';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StrategyDetails from './StrategyDetails';
import { formatDate, formatPercentage } from '@/lib/fmt';
import { ChevronRight, ChevronDown } from 'lucide-react';
import MiniNavChart from './MiniNavChart';

interface StrategiesClientProps {
  initialStrategies: StrategySummary[];
  performanceData: Record<string, StrategyPerformance>;
}

export default function StrategiesClient({ initialStrategies = [], performanceData }: StrategiesClientProps) {
  const [strategies] = useState<StrategySummary[]>(initialStrategies);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('code');
  const [expandedStrategyCode, setExpandedStrategyCode] = useState<string | null>(null);
  const router = useRouter();

  const filteredAndSortedStrategies = useMemo(() => {
    if (!strategies || strategies.length === 0) return [];

    return strategies
      .filter(strategy =>
        strategy.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'return') {
          return ((b.ann_return ?? 0) - (a.ann_return ?? 0));
        }
        if (sortBy === 'volatility') {
          return ((b.ann_volatility ?? 0) - (a.ann_volatility ?? 0));
        }
        return a.code.localeCompare(b.code);
      });
  }, [strategies, searchTerm, sortBy]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
        <Input
          type="text"
          placeholder="Search strategies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="code">Code</SelectItem>
            <SelectItem value="return">Annual Return</SelectItem>
            <SelectItem value="volatility">Annual Volatility</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strategy Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Annual Return</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Annual Volatility</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAV History</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {filteredAndSortedStrategies && filteredAndSortedStrategies.length > 0 ? (
              filteredAndSortedStrategies.map((strategy) => (
                <React.Fragment key={strategy.code}>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setExpandedStrategyCode(expandedStrategyCode === strategy.code ? null : strategy.code)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {expandedStrategyCode === strategy.code ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{strategy.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(strategy.last_updated)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap ${
                      strategy.ann_return && strategy.ann_return > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercentage(strategy.ann_return)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-yellow-600`}>
                      {formatPercentage(strategy.ann_volatility)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-24 h-12">
                        <MiniNavChart data={strategy.nav_history} />
                      </div>
                    </td>
                  </tr>
                  {expandedStrategyCode === strategy.code && (
                    <tr>
                      <td colSpan={6} className="p-4">
                        <StrategyDetails performanceData={performanceData[strategy.code]} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No strategies found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredAndSortedStrategies.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No strategies found</p>
      )}
      <Button
        onClick={() => router.push('/strategies/compare')}
        className="mt-8 w-full"
      >
        Compare Strategies
      </Button>
    </div>
  );
}
