import { NEXT_PUBLIC_API_URL } from "@/config";

// types.ts
export interface TimeSeriesPredictionResponse {
  features: {
    [key: string]: { [date: string]: number };
  };
  target: { [date: string]: number };
  prediction: { [date: string]: number };
}

// Define an in-memory cache object
const predictionsCache: Record<
  string,
  { data: TimeSeriesPredictionResponse | null; expiresAt: number }
> = {};

export const getPredictions = async (
  name: string
): Promise<TimeSeriesPredictionResponse | null> => {
  const cacheKey = name;
  const currentTime = Date.now();

  // Check if data is in cache and still valid
  if (
    predictionsCache[cacheKey] &&
    predictionsCache[cacheKey].expiresAt > currentTime
  ) {
    return predictionsCache[cacheKey].data;
  }

  // Build the API endpoint
  const endpoint = new URL("/api/predictions", NEXT_PUBLIC_API_URL);
  endpoint.searchParams.append("name", name);

  try {
    // Fetch data from the API
    const res = await fetch(endpoint.toString());

    if (!res.ok) {
      console.error("Failed to fetch predictions", await res.text());
      return null;
    }

    const data: TimeSeriesPredictionResponse = await res.json();

    // Store the data in the cache with a 2-hour expiration
    predictionsCache[cacheKey] = {
      data,
      expiresAt: currentTime + 2 * 60 * 60 * 1000, // 2 hours in milliseconds
    };

    return data;
  } catch (error) {
    console.error("Error fetching predictions", error);
    return null;
  }
};
