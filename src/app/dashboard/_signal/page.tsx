import React from "react";
import SignalChart from "./SignalChart";
import { fetchSignalCodes, fetchSignalByCode } from "@/app/api/all";


export default async function SignalSection() {
  try {
    // Fetch signal codes and their data
    const signalCodes = await fetchSignalCodes();
    if (!signalCodes?.length) {
      return (
        <div className="text-center text-gray-400">No signals available.</div>
      );
    }

    const signalPromises = signalCodes.map((code) => fetchSignalByCode(code));
    const signals = await Promise.all(signalPromises);

    if (!signals?.length) {
      return (
        <div className="text-center text-gray-400">No signals available.</div>
      );
    }

    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mt-2">
        {signals.map((signal) => {
          const filteredData = Object.entries(signal.data).filter(
            ([date]) => new Date(date) >= twoYearsAgo
          );

          const chartData = {
            labels: filteredData.map(([date]) => date),
            datasets: [
              {
                label: signal.code,
                data: filteredData.map(([date, value]) => ({
                  x: new Date(date).getTime(),
                  y: value,
                })),
                borderColor: "cyan",
                backgroundColor: "rgba(0, 255, 255, 0.1)",
                fill: true,
                tension: 0.3,
              },
            ],
          };

          return (
            <SignalChart
              key={signal.code}
              data={chartData}
            />
          );
        })}
      </div>
    );
  } catch (error) {
    console.error("Error fetching signals:", error);
    return (
      <div className="text-center text-red-500">
        Failed to load signals. Please try again later.
      </div>
    );
  }
}
