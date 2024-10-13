// app/strategies/api

import { StrategySummary, Strategy } from "./types";

const apiUrl = process.env.API_URL || "";

const noCacheOptions: RequestInit = {
  cache: 'no-store',
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
};

export async function fetchStrategiesSummary(): Promise<StrategySummary[]> {
  const response = await fetch(`${apiUrl}/api/data/strategies/summary`, noCacheOptions);
  if (!response.ok) {
    throw new Error("Failed to fetch strategies summary");
  }
  return response.json();
}

export async function fetchStrategy(code: string): Promise<Strategy> {
  const response = await fetch(`${apiUrl}/api/data/strategies/${code}`, noCacheOptions);
  if (!response.ok) {
    throw new Error(`Failed to fetch strategy ${code}`);
  }
  return response.json();
}

// New interface for the strategy performance data
export interface StrategyPerformance {
  d: string[]; // Assuming dates are returned as strings
  v: number[];
  b: number[];
}

export async function fetchStrategyPerformance(
  code: string
): Promise<StrategyPerformance> {
  const response = await fetch(`${apiUrl}/api/data/strategies/${code}/performance`, noCacheOptions);
  if (!response.ok) {
    throw new Error(`Failed to fetch performance data for strategy ${code}`);
  }
  return response.json();
}
