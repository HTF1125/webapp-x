// app/dashboard/types.ts

import { PeriodPerformance } from "@/api/all";


export const periods = ["1d", "1w", "1m", "3m", "6m", "1y", "3y", "mtd", "ytd"] as const;
export type Period = typeof periods[number];


export interface TableData {
  data: PeriodPerformance[];
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
