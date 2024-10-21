// app/strategies/api.ts

import { StrategySummary, Strategy, StrategyPerformance } from "./types";

const API_URL = process.env.API_URL || "";

// Add this line to print the API_URL during build
console.log("API_URL:", API_URL);

// Set cache duration to 1 hour (3600 seconds)
const CACHE_DURATION = 3600;

const cacheOptions: RequestInit = {
  next: { revalidate: CACHE_DURATION },
  headers: {
    'Cache-Control': `max-age=0, s-maxage=${CACHE_DURATION}, stale-while-revalidate`,
  },
};

export async function fetchStrategiesSummary(): Promise<StrategySummary[]> {
  const url = new URL("/api/data/strategies/summary", API_URL);
  console.log("Fetching strategies summary from URL:", url.toString());
  try {
    const response = await fetch(url.toString(), cacheOptions);
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
  const url = new URL(`/api/data/strategies/${code}`, API_URL);
  console.log(`Fetching strategy ${code} from URL:`, url.toString());
  try {
    const response = await fetch(url.toString(), cacheOptions);
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
  const url = new URL(`/api/data/strategies/${code}/performance`, API_URL);
  console.log(`Fetching performance data for strategy ${code} from URL:`, url.toString());
  try {
    const response = await fetch(url.toString(), cacheOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Failed to fetch performance data for strategy ${code}:`, error);
    throw error;
  }
}
