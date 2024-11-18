// app/strategies/api.ts

import { Strategy } from "./types";

const API_URL = process.env.API_URL || "";

// Add this line to print the API_URL during build
console.log("API_URL:", API_URL);

// Set cache duration to 1 hour (3600 seconds)
const CACHE_DURATION = 20;

const cacheOptions: RequestInit = {
  next: { revalidate: CACHE_DURATION },
  headers: {
    "Cache-Control": `max-age=0, s-maxage=${CACHE_DURATION}, stale-while-revalidate`,
  },
};

export async function fetchStrategies(): Promise<Strategy[]> {
  const url = new URL("/api/data/strategies", API_URL);
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

export async function fetchStrategyById(id: string): Promise<Strategy> {
  const url = new URL(`/api/data/strategies/${id}`, API_URL);
  console.log(
    `Fetching performance data for strategy ${id} from URL:`,
    url.toString()
  );
  try {
    const response = await fetch(url.toString(), cacheOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(
      `Failed to fetch performance data for strategy ${id}:`,
      error
    );
    throw error;
  }
}
