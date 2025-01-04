export type Period = "1d" | "1w" | "1m" | "3m" | "6m" | "1y" | "3y" | "mtd" | "ytd";

export interface PerformanceGrouped {
  group: string;
  name: string;
  code: string;
  pct_chg_1d?: number;
  pct_chg_1w?: number;
  pct_chg_1m?: number;
  pct_chg_3m?: number;
  pct_chg_6m?: number;
  pct_chg_1y?: number;
  pct_chg_3y?: number;
  pct_chg_mtd?: number;
  pct_chg_ytd?: number;
}


import { NEXT_PUBLIC_API_URL } from "@/config";

// Function to fetch performance data
export async function fetchPerformanceGrouped(): Promise<PerformanceGrouped[]> {
  const endpoint = new URL("/api/performances-grouped", NEXT_PUBLIC_API_URL);

  try {
    const response = await fetch(endpoint.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store", // Ensure the data is not cached
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Failed to fetch index groups.");
    }

    const data = await response.json();
    return data; // Return the data directly
  } catch (error) {
    console.error("Error fetching performance data:", error);
    throw error;
  }
}
