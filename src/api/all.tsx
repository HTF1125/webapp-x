// src/api/all.ts

import { API_URL, NEXT_PUBLIC_API_URL } from "@/config";

// Interfaces
export const IndexGroups = [
  { code: "local-indices", title: "Local Indices" },
  { code: "global-markets", title: "Global Markets" },
  { code: "us-gics", title: "US GICS" },
  { code: "global-bonds", title: "Global Bonds" },
  { code: "commodities", title: "Commodities" },
  { code: "themes", title: "Themes" },
] as const;

export interface Signal {
  _id: string;
  code: string;
  data: Record<string, number>;
}

export interface Book {
  d: string[]; // Dates
  v: number[]; // NAV values
  l: number[]; // Liquidity values
  b: number[]; // Benchmark values
  s: { [ticker: string]: number[] }[]; // Holding shares
  c: { [ticker: string]: number[] }[]; // Holding capitals
  w: { [ticker: string]: number[] }[]; // Holding weights
  a: { [ticker: string]: number[] }[]; // Allocation weights
}

export interface Strategy {
  _id: string;
  code: string;
  last_updated: string;
  ann_return: number;
  ann_volatility: number;
  nav_history: number[];
  book: Book;
}

export interface PeriodPerformance {
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

export interface IndexGroupPeriodPerformances {
  [index: string]: PeriodPerformance[];
}
const fetchOptions: RequestInit = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export async function fetchAllIndexGroupPerformances(): Promise<IndexGroupPeriodPerformances> {
  try {
    const endpoint = new URL("/api/data/index_groups/all", API_URL).toString();

    const response = await fetch(endpoint, fetchOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: IndexGroupPeriodPerformances = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching index group performance data:", error);
    throw error;
  }
}

export const periods = [
  "1d",
  "1w",
  "1m",
  "3m",
  "6m",
  "1y",
  "3y",
  "mtd",
  "ytd",
] as const;
export type Period = (typeof periods)[number];

export async function fetchPerformancesByCode(
  code: string
): Promise<PeriodPerformance[]> {
  const endpoint = new URL(
    `api/data/index_groups/performances/${encodeURIComponent(code)}`,
    NEXT_PUBLIC_API_URL
  ).toString();

  try {
    const response = await fetch(endpoint, {
      method: "GET", // Explicitly specifying the GET method
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      // Attempt to parse error message from response
      const errorData = await response.json();
      console.error(`Error fetching data:`, errorData);
      throw new Error(errorData.error || "Failed to fetch performances");
    }

    const data: PeriodPerformance[] = await response.json();
    return data;
  } catch (error) {
    throw error; // Re-throw the error to allow the caller to handle it
  }
}

export async function fetchSignalCodes(): Promise<string[]> {
  const endpoint = new URL("/api/data/signals/codes/", API_URL).toString();
  const response = await fetch(endpoint, {
    method: "GET", // Explicitly specifying the GET method
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error(`Error fetching signal codes:`, errorData);
    throw new Error(errorData.error || "Failed to fetch signal codes");
  }

  const data: string[] = await response.json();
  return data;
}

export async function fetchSignalByCode(code: string): Promise<Signal> {
  const endpoint = new URL(
    `api/data/signals/${encodeURIComponent(code)}`,
    API_URL
  ).toString();
  try {
    const response = await fetch(endpoint, {
      method: "GET", // Explicitly specifying the GET method
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch signal data");
    }

    const data: Signal = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export interface TickerInfo {
  code: string; // Unique identifier for the ticker
  name?: string; // Optional name of the ticker
  exchange?: string; // Optional exchange where the ticker is listed
  market?: string; // Optional market type (e.g., equity, bond)
  source?: string; // Source of the ticker information, default is "YAHOO"
  bloomberg?: string; // Optional Bloomberg identifier
  fred?: string; // Optional Federal Reserve Economic Data (FRED) identifier
  yahoo?: string; // Optional Yahoo identifier
  remark?: string; // Optional remarks or additional information
}

export async function fetchAllTickers(): Promise<TickerInfo[]> {
  const endpoint = new URL(
    "/api/data/tickers/all",
    NEXT_PUBLIC_API_URL
  ).toString();

  const fetchOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  try {
    const response = await fetch(endpoint, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching all tickers:", errorData);
      throw new Error(errorData.error || "Failed to fetch tickers.");
    }

    const tickers: TickerInfo[] = await response.json();
    return tickers;
  } catch (error) {
    console.error("Failed to fetch all tickers:", error);
    throw error;
  }
}

export async function updateTicker(
  code: string,
  tickerUpdate: Partial<TickerInfo>
): Promise<TickerInfo> {
  const endpoint = new URL(
    `/api/data/tickers/${encodeURIComponent(code)}`,
    NEXT_PUBLIC_API_URL
  ).toString();

  try {
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tickerUpdate),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error updating ticker ${code}:`, errorData);
      throw new Error(
        errorData.error || `Failed to update ticker with code ${code}.`
      );
    }

    const updatedTicker: TickerInfo = await response.json();
    return updatedTicker;
  } catch (error) {
    console.error(`Failed to update ticker ${code}:`, error);
    throw error;
  }
}

export async function fetchTickerByCode(code: string): Promise<TickerInfo> {
  const endpoint = new URL(
    `/api/data/tickers/${encodeURIComponent(code)}`,
    API_URL
  ).toString();

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error fetching ticker with code ${code}:`, errorData);
      throw new Error(
        errorData.error || `Failed to fetch ticker with code ${code}.`
      );
    }

    const ticker: TickerInfo = await response.json();
    return ticker;
  } catch (error) {
    console.error(`Failed to fetch ticker with code ${code}:`, error);
    throw error;
  }
}

export async function addNewTicker(
  ticker: Partial<TickerInfo>
): Promise<TickerInfo> {
  const endpoint = new URL(
    "/api/data/tickers/add",
    NEXT_PUBLIC_API_URL
  ).toString();

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticker),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error adding new ticker:", errorData);
      throw new Error(errorData.error || "Failed to add new ticker.");
    }

    const newTicker: TickerInfo = await response.json();
    return newTicker;
  } catch (error) {
    console.error("Failed to add new ticker:", error);
    throw error;
  }
}

export async function fetchResearchFileCodes(): Promise<string[]> {
  const endpoint = new URL(
    "/api/data/research_file/codes/",
    API_URL
  ).toString();
  const response = await fetch(endpoint, {
    method: "GET", // Explicitly specifying the GET method
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error(`Error fetching signal codes:`, errorData);
    throw new Error(errorData.error || "Failed to fetch signal codes");
  }

  const data: string[] = await response.json();
  return data;
}

export async function fetchResearchFileByCode(
  code: string
): Promise<Uint8Array> {
  const endpoint = new URL(
    `/api/data/research_file/${code}`,
    NEXT_PUBLIC_API_URL
  ).toString();

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Accept: "application/pdf",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch PDF file: ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer); // Convert ArrayBuffer to Uint8Array
}

export interface Ticker {
  _id : string;
  code: string; // Unique identifier
  name?: string; // Optional name
  exchange?: string; // Optional exchange
  market?: string; // Optional market
  source: string; // Default source is "YAHOO"
  bloomberg?: string; // Optional bloomberg field
  fred?: string; // Optional fred field
  yahoo?: string; // Optional yahoo field
  remark?: string; // Optional remark
}


export async function fetchTickers(): Promise<Ticker[]> {
  const endpoint = new URL(
    "/api/data/tickers/",
    API_URL
  ).toString();

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching ticker with code ${code}:", errorData);
      throw new Error(
        "errorData.error || Failed to fetch ticker with code ${code}."
      );
    }

    const tickers: Ticker[] = await response.json();
    return tickers;
  } catch (error) {
    console.error("Failed to fetch ticker with code ${code}:", error);
    throw error;
  }
}



