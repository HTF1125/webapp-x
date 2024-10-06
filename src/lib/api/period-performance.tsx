// lib/api.ts

import { API_URL } from "./url";

export interface PeriodPerformances {
  index: string;
  level: number;
  "1D": number;
  "1W": number;
  "1M": number;
  "3M": number;
  "6M": number;
  "1Y": number;
  "3Y": number;
  MTD: number;
  YTD: number;
}

export async function fetchPeriodPerformances(
  asofdate: string,
  group: string
): Promise<PeriodPerformances[]> {
  try {
    const fullUrl = API_URL
      ? `${API_URL}/api/data/performance?asofdate=${asofdate}&group=${group}`
      : `/api/data/performance?asofdate=${asofdate}&group=${group}`;

    const response = await fetch(fullUrl, {
      next: { revalidate: 60 },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorBody}`
      );
    }

    const data = await response.json();

    // Validate the response data
    if (!Array.isArray(data)) {
      throw new Error("Invalid response format: expected an array");
    }

    // Type guard to ensure each item in the array matches PeriodPerformances
    const isValidPeriodPerformance = (
      item: any
    ): item is PeriodPerformances => {
      return (
        typeof item.index === "string" &&
        typeof item.level === "number" &&
        typeof item["1D"] === "number" &&
        typeof item["1W"] === "number" &&
        typeof item["1M"] === "number" &&
        typeof item["3M"] === "number" &&
        typeof item["6M"] === "number" &&
        typeof item["1Y"] === "number" &&
        typeof item["3Y"] === "number" &&
        typeof item.MTD === "number" &&
        typeof item.YTD === "number"
      );
    };

    if (!data.every(isValidPeriodPerformance)) {
      throw new Error("Invalid data format in response");
    }

    return data;
  } catch (error) {
    console.error("Error fetching period performances:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}
