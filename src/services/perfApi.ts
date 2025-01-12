// perfAPI.ts

import { fetchData, rurl } from "@/lib/apiClient";

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

// Function to fetch performance data
export async function fetchPerformanceGrouped(): Promise<PerformanceGrouped[]> {
  try {
    const data = await fetchData(
      rurl("/api/performances-grouped"),
      {},
      { method: "GET" }
    );
    return data;
  } catch (error) {
    console.error("Error fetching performance data:", error);
    throw error;
  }
}
