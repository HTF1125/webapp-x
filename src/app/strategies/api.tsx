// app/strategies/api.ts

import { StrategySummary, Strategy, StrategyPerformance } from "./types";

const apiUrl = process.env.API_URL || "";

// Set cache duration to 1 hour (3600 seconds)
const CACHE_DURATION = 3600;

const cacheOptions: RequestInit = {
  next: { revalidate: CACHE_DURATION },
  headers: {
    'Cache-Control': `max-age=0, s-maxage=${CACHE_DURATION}, stale-while-revalidate`,
  },
};

export async function fetchStrategiesSummary(): Promise<StrategySummary[]> {
  try {
    const response = await fetch(`${apiUrl}/api/data/strategies/summary`, cacheOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Failed to fetch strategies summary:", error);
    throw error;
  }
}

export async function fetchStrategy(code: string): Promise<Strategy> {
  try {
    const response = await fetch(`${apiUrl}/api/data/strategies/${code}`, cacheOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Failed to fetch strategy ${code}:`, error);
    throw error;
  }
}

export async function fetchStrategyPerformance(code: string): Promise<StrategyPerformance> {
  try {
    const response = await fetch(`${apiUrl}/api/data/strategies/${code}/performance`, cacheOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Failed to fetch performance data for strategy ${code}:`, error);
    throw error;
  }
}
