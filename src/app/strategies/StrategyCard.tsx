// components/StrategyCard.tsx
"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Strategy } from "./types";

const MiniNavChart = dynamic(() => import("./MiniNavChart"), { ssr: false });

export function StrategyCard({ strategy }: { strategy: Strategy }) {
  const lastIndex = strategy.book.d.length - 1;
  const lastDate = new Date(strategy.book.d[lastIndex]).toLocaleDateString();

  return (
    <Link href={`/strategies/${strategy.code}`}>
      <div className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-semibold mb-2">{strategy.code}</h2>
        <p>Last updated: {lastDate}</p>
        <p>Current NAV: {strategy.book.v[lastIndex].toFixed(2)}</p>
        <p>Current Liquidity: {strategy.book.l[lastIndex].toFixed(2)}</p>
        <p>Annual Return: {strategy.ann_return !== null ? (strategy.ann_return * 100).toFixed(2) : 'N/A'}%</p>
        <p>Annual Volatility: {strategy.ann_volatility !== null ? (strategy.ann_volatility * 100).toFixed(2) : 'N/A'}%</p>
        <div className="h-16 mt-2">
          <MiniNavChart data={strategy.nav_history} />
        </div>
      </div>
    </Link>
  );
}