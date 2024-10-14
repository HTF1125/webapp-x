// app/strategies/page.tsx

import { fetchStrategiesSummary, fetchStrategyPerformance } from './api';
import StrategiesClient from './StrategiesClient';
import { StrategyPerformance } from './types';

export default async function StrategiesPage() {
  const strategies = await fetchStrategiesSummary();

  // Pre-fetch performance data for all strategies
  const performanceData: Record<string, StrategyPerformance> = {};
  for (const strategy of strategies) {
    performanceData[strategy.code] = await fetchStrategyPerformance(strategy.code);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Strategies</h1>
      <StrategiesClient initialStrategies={strategies} performanceData={performanceData} />
    </div>
  );
}
