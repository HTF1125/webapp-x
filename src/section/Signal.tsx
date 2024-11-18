import React from "react";
import Section from "@/components/Section";
import LineChart from "@/components/chart/LineChart";

export interface Signal {
  _id: string;
  code: string;
  data: Record<string, number>;
}

export default async function SignalSection() {
  const API_URL = process.env.API_URL || "";
  const CACHE_DURATION = 60;

  // Fetch Signals from API
  const fetchSignals = async (): Promise<Signal[] | undefined> => {
    try {
      const response = await fetch(
        new URL("/api/data/signals", API_URL).toString(),
        {
          next: { revalidate: CACHE_DURATION },
          headers: {
            "Cache-Control": `max-age=0, s-maxage=${CACHE_DURATION}, stale-while-revalidate`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch signals:", response.statusText);
        return undefined;
      }

      const signals: Signal[] = await response.json();
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
  };

  // Fetch signal data
  const signals = await fetchSignals();

  // Handle error or empty state
  if (!signals || signals.length === 0) {
    return (
      <Section header="Signals">
        <div className="text-center text-gray-400">No signals available.</div>
      </Section>
    );
  }

  // Get the current date and calculate the cutoff for 2 years ago
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  // Render SignalChart directly
  return (
    <Section header="Signals">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {signals.map((signal) => {
          // Filter data to include only the last 2 years
          const filteredData = Object.entries(signal.data).filter(
            ([date]) => new Date(date) >= twoYearsAgo
          );

          // Prepare chart data for LineChart
          const chartData = {
            labels: filteredData.map(([date]) => date), // Dates as labels
            datasets: [
              {
                label: signal.code, // Use the signal code as the label
                data: filteredData.map(([date, value]) => ({
                  x: date,
                  y: value,
                })), // Provide x (date) and y (value) format for LineChart
                borderColor: "cyan",
                backgroundColor: "rgba(0, 255, 255, 0.1)", // Light cyan fill
                fill: true,
                tension: 0.3, // Smooth lines
              },
            ],
          };

          return (
            <LineChart
              key={signal._id} // Use signal ID as key
              title={signal.code} // Use the signal code as the title
              data={chartData} // Pass formatted chart data
            />
          );
        })}
      </div>
    </Section>
  );
}
