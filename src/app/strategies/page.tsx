// app/strategies/page.tsx

import Link from 'next/link';

import { StrategySummary } from './types';
import { fetchStrategiesSummary } from './api';
import dynamic from 'next/dynamic';
import ClientOnly from '../../components/ClientOnly';

// Dynamically import MiniNavChart with SSR disabled
const MiniNavChart = dynamic(() => import('./MiniNavChart'), { ssr: false });

export default async function StrategiesListPage() {
  const strategies = await fetchStrategiesSummary();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Strategies</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {strategies.map((strategy) => (
          <StrategyCard key={strategy.code} strategy={strategy} />
        ))}
      </div>
    </div>
  );
}

function StrategyCard({ strategy }: { strategy: StrategySummary }) {
  return (
    <Link href={`/strategies/${strategy.code}`}>
      <div className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-semibold mb-2">{strategy.code}</h2>
        <p>Last updated: {strategy.last_updated || 'N/A'}</p>
        <p>Annual Return: {strategy.ann_return !== null ? (strategy.ann_return * 100).toFixed(2) : 'N/A'}%</p>
        <p>Annual Volatility: {strategy.ann_volatility !== null ? (strategy.ann_volatility * 100).toFixed(2) : 'N/A'}%</p>
        <div className="h-16 mt-2">
          <ClientOnly>
            <MiniNavChart data={strategy.nav_history} />
          </ClientOnly>
        </div>
      </div>
    </Link>
  );
}