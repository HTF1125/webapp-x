import { NEXT_PUBLIC_API_URL } from "@/config";

// types.ts
export interface TimeSeriesPredictionResponse {
  features: {
    [key: string]: { [date: string]: number };
  };
  target: { [date: string]: number };
  prediction: { [date: string]: number };
}

// lib/api.ts
export const getPredictions = async (
  name: string
): Promise<TimeSeriesPredictionResponse | null> => {
  const endpoint = new URL("/api/predictions", NEXT_PUBLIC_API_URL);
  endpoint.searchParams.append("name", name);
  const res = await fetch(endpoint.toString());

  if (!res.ok) {
    // Handle errors appropriately
    console.error("Failed to fetch predictions", await res.text());
    return null;
  }

  return await res.json();
};
