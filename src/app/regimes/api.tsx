// app/regimes/api.ts

export interface Regime {
  _id: string;
  code: string;
  data: Record<string, string>;
}

const API_URL = process.env.API_URL || "";

// Add this line to print the API_URL during build
console.log("API_URL (Regimes):", API_URL);

// Set cache duration to 3 hours (10800 seconds)
const CACHE_DURATION = 10800;

const cacheOptions: RequestInit = {
  next: { revalidate: CACHE_DURATION },
  headers: {
    'Cache-Control': `max-age=0, s-maxage=${CACHE_DURATION}, stale-while-revalidate`,
  },
};

export async function fetchRegimes(): Promise<Regime[]> {
  const url = new URL("/api/data/regimes", API_URL);
  console.log("Fetching regimes from URL:", url.toString());

  try {
    const response = await fetch(url.toString(), cacheOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid data format: expected an array of Regime objects");
    }

    return data as Regime[];
  } catch (error) {
    console.error("Error fetching regimes:", error);
    throw error;
  }
}
