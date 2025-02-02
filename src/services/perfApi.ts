// perfAPI.ts

import { rurl } from "@/lib/apiClient";

export type Period =
  | "1d"
  | "1w"
  | "1m"
  | "3m"
  | "6m"
  | "1y"
  | "3y"
  | "mtd"
  | "ytd";

export interface PerformanceGrouped {
  group: string;
  name: string;
  code: string;
  level: number;
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

export async function fetchPerformanceGrouped(): Promise<PerformanceGrouped[]> {
  try {
    const response = await fetch(rurl("/api/performances-grouped"), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch performance data.");
    }

    return response.json(); // Parse the response as JSON
  } catch (error) {
    console.error("Error fetching performance data:", error);
    throw error;
  }
}


