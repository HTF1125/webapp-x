// lib/api.ts

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

const API_URL = process.env.API_URL || '';

export async function fetchPeriodPerformances(
  asofdate: string,
  group: string
): Promise<PeriodPerformances[]> {
  const fullUrl = new URL('/api/data/performance', API_URL);
  fullUrl.searchParams.append('asofdate', asofdate);
  fullUrl.searchParams.append('group', group);

  try {
    const response = await fetch(fullUrl.toString(), {
      headers: {
        "Content-Type": "application/json",
      },
      cache: 'no-store' // This ensures fresh data is fetched every time
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid response format: expected an array");
    }

    // Validate the response data
    const validatedData = data.map(item => {
      if (
        typeof item.index !== "string" ||
        typeof item.level !== "number" ||
        typeof item["1D"] !== "number" ||
        typeof item["1W"] !== "number" ||
        typeof item["1M"] !== "number" ||
        typeof item["3M"] !== "number" ||
        typeof item["6M"] !== "number" ||
        typeof item["1Y"] !== "number" ||
        typeof item["3Y"] !== "number" ||
        typeof item.MTD !== "number" ||
        typeof item.YTD !== "number"
      ) {
        throw new Error("Invalid data format in response");
      }
      return item as PeriodPerformances;
    });

    return validatedData;
  } catch (error) {
    console.error("Error fetching period performances:", error instanceof Error ? error.message : "Unknown error");
    throw error; // Re-throw the error for the caller to handle
  }
}