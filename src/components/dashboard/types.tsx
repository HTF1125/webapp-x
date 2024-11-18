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
  data: KeyPerformance[];
  title: string;
}

export const tableGroups = [
  { group: "local-indices", title: "Local Indices" },
  { group: "global-markets", title: "Global Markets" },
  { group: "us-gics", title: "US GICS" },
  { group: "global-bonds", title: "Global Bonds" },
  { group: "commodities", title: "Commodities" },
  { group: "theme", title: "Theme" },
] as const;
