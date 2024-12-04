// app/dashboard/api.ts

import { PeriodPerformance } from "@/api/all";

// app/dashboard/types.ts

export const periods = ["1d", "1w", "1m", "3m", "6m", "1y", "3y", "mtd", "ytd"] as const;
export type Period = typeof periods[number];

export interface KeyPerformance {
  code: string;
  level: number;
  pct_chg_1d: number;
  pct_chg_1w: number;
  pct_chg_1m: number;
  pct_chg_3m: number;
  pct_chg_6m: number;
  pct_chg_1y: number;
  pct_chg_3y: number;
  pct_chg_mtd: number;
  pct_chg_ytd: number;
}

export interface TableData {
  data: PeriodPerformance[];
  title: string;
}


const API_URL = process.env.API_URL || "";


interface FetchOptions {
  group: string;
  forceRefresh?: boolean;
}

export async function fetchPeriodPerformances({
  group,
  forceRefresh = false
}: FetchOptions): Promise<KeyPerformance[]> {
  const url = new URL("/api/data/performance", API_URL);
  url.searchParams.set("group", group);

  const fetchOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...(forceRefresh
      ? { cache: 'no-store' as const }
      : { next: { revalidate: 60 } }),
  };

  try {
    const response = await fetch(url.toString(), fetchOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid data format: expected an array");
    }

    return data;
  } catch (error) {
    console.error("Error fetching period performances:", error);
    throw error;
  }
}


export const tableGroups = [
  { group: "local-indices", title: "Local Indices" },
  { group: "global-markets", title: "Global Markets" },
  { group: "us-gics", title: "US GICS" },
  { group: "global-bonds", title: "Global Bonds" },
  { group: "commodities", title: "Commodities" },
  { group: "theme", title: "Theme" },
] as const;
