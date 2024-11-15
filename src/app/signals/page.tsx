import SignalList from "./SignalList";

// Signal Interface
export interface Signal {
  _id: string;
  code: string;
  data: Record<string, number>; // Data entries as date-value pairs
}

// Main Signals Page Component
export default async function SignalsPage() {
  const API_URL = process.env.API_URL || "";
  const CACHE_DURATION = 60; // Cache duration in seconds (3 hours)

  const cacheOptions: RequestInit = {
    next: { revalidate: CACHE_DURATION },
    headers: {
      "Cache-Control": `max-age=0, s-maxage=${CACHE_DURATION}, stale-while-revalidate`,
    },
  };

  // Fetch Signals from API
  async function fetchSignals(): Promise<Signal[] | undefined> {
    try {
      console.log("Fetching signals from:", `${API_URL}/api/data/signals`);

      const response = await fetch(
        new URL("/api/data/signals", API_URL).toString(),
        cacheOptions
      );

      if (!response.ok) {
        console.error("Failed to fetch signals:", response.statusText);
        return undefined;
      }

      const signals: Signal[] = await response.json();

      // Ensure consistent data structure
      return signals.map((signal) => ({
        ...signal,
        data: Object.fromEntries(
          Object.entries(signal.data).map(([date, value]) => [date, value])
        ),
      }));
    } catch (error) {
      console.error("Error fetching signals:", error);
      return undefined;
    }
  }

  try {
    const signals = await fetchSignals();

    if (!signals || signals.length === 0) {
      console.warn("No signals available.");
      return <SignalList signals={[]} error="No signals available." />;
    }

    return <SignalList signals={signals} />;
  } catch (error) {
    console.error("Error fetching signals:", error);
    return <SignalList signals={[]} error="Failed to load signals." />;
  }
}
