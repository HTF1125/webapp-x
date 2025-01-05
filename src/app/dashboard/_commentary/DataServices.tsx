export interface MarketCommentary {
  asofdate: string; // Date in string format (YYYY-MM-DD)
  frequency: string; // e.g., "Daily"
  content: string; // Content of the market commentary
}

import { NEXT_PUBLIC_API_URL } from "@/config";

// Function to fetch performance data
export async function fetchMarketCommentary(): Promise<MarketCommentary> {
  const endpoint = new URL("/api/market_commentary", NEXT_PUBLIC_API_URL);

  try {
    const response = await fetch(endpoint.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Failed to fetch index groups.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching performance data:", error);
    throw error;
  }
}
