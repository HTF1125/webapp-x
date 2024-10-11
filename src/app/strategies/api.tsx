import { StrategySummary, Strategy } from "./types";

const apiUrl = process.env.API_URL || "";

export async function fetchStrategiesSummary(): Promise<StrategySummary[]> {
  const response = await fetch(`${apiUrl}/api/data/strategies/summary`);
  if (!response.ok) {
    throw new Error("Failed to fetch strategies summary");
  }
  return response.json();
}

export async function fetchStrategy(code: string): Promise<Strategy> {
  const response = await fetch(`${apiUrl}/api/data/strategies/${code}`);
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
  const response = await fetch(`${apiUrl}/api/data/strategies/${code}/performance`);
  if (!response.ok) {
    throw new Error(`Failed to fetch performance data for strategy ${code}`);
  }
  return response.json();
}
