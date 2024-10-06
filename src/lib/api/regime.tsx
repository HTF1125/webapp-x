// lib/api.ts

import { API_URL } from "./url";


export interface Regime {
  _id: string;
  code: string;
  data: Record<string, string>;
}

export async function fetchRegimes(): Promise<Regime[]> {
  try {
    const fullUrl = API_URL
      ? `${API_URL}/api/data/regimes`
      : "/api/data/regimes";
    const response = await fetch(fullUrl, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as Regime[];
  } catch (error) {
    console.error("Error fetching regimes:", error);
    return []; // Return an empty array in case of error
  }
}
