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
