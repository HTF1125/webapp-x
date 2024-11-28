import React from "react";
import Section from "@/components/Section";
import SignalChart from "@/components/chart/SignalChart";
import { fetchSignalCodes, fetchSignalByCode } from "@/api/all";

export default async function SignalSection() {
  try {
    // Fetch all signal codes
    const signalCodes = await fetchSignalCodes();

    if (!signalCodes || signalCodes.length === 0) {
      return (
        <Section header="Signals">
          <div className="text-center text-gray-400">No signals available.</div>
        </Section>
      );
    }

    // Fetch details for each signal code
    const signalPromises = signalCodes.map((code) => fetchSignalByCode(code));
    const signals = await Promise.all(signalPromises);

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

    // Render the charts
    return (
      <Section header="Signals">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {signals.map((signal) => {
            // Filter data to include only the last 2 years
            const filteredData = Object.entries(signal.data).filter(
              ([date]) => new Date(date) >= twoYearsAgo
            );

            // Prepare chart data for SignalChart
            const chartData = {
              labels: filteredData.map(([date]) => date), // Dates as labels
              datasets: [
                {
                  label: signal.code, // Use the signal code as the label
                  data: filteredData.map(([date, value]) => ({
                    x: new Date(date).getTime(), // Convert x to a timestamp
                    y: value, // Keep y as a number
                  })), // Provide x (timestamp) and y (value) format for SignalChart
                  borderColor: "cyan",
                  backgroundColor: "rgba(0, 255, 255, 0.1)", // Light cyan fill
                  fill: true,
                  tension: 0.3, // Smooth lines
                },
              ],
            };

            return (
              <SignalChart
                key={signal.code} // Use signal ID as key
                title={signal.code} // Use the signal code as the title
                data={chartData} // Pass formatted chart data
              />
            );
          })}
        </div>
      </Section>
    );
  } catch (error) {
    console.error("Error fetching signals:", error);
    return (
      <Section header="Signals">
        <div className="text-center text-red-500">
          Failed to load signals. Please try again later.
        </div>
      </Section>
    );
  }
}
