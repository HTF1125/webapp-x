// app/dashboard/api.ts

import { KeyPerformance } from "./types";

const API_URL = process.env.API_URL || "";

// Add this line to print the API_URL during build
console.log("API_URL:", API_URL);

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

  // Add another print statement here to see the full URL
  console.log("Fetching from URL:", url.toString());

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
