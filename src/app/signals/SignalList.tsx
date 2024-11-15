// app/signals/SignalList.tsx
"use client";

import React from "react";
import SignalChart from "./SignalChart";

export interface Signal {
  _id: string;
  code: string;
  data: Record<string, number>; // Data entries as date-value pairs
}

interface SignalListProps {
  signals?: Signal[];
  error?: string;
}

const SignalList: React.FC<SignalListProps> = ({ signals, error }) => {
  if (error) {
    return <p className="text-center text-red-400">{error}</p>;
  }

  if (!signals || signals.length === 0) {
    return <p className="text-center text-gray-400">No signals available.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {signals.map((signal) => {
        const chartData = {
          labels: Object.keys(signal.data).map((date) => new Date(date)),
          datasets: [
            {
              label: "Signal Value",
              data: Object.values(signal.data),
              borderColor: "rgba(100, 200, 255, 1)", // Line color
              backgroundColor: "rgba(100, 200, 255, 0.2)", // Fill color
              fill: true, // Fill area under line
            },
          ],
        };

        return (
          <div
            key={signal._id}
            className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-4"
          >
            <h2 className="text-lg font-semibold mb-2 text-gray-100">{signal.code}</h2>
            <SignalChart data={chartData} />
          </div>
        );
      })}
    </div>
  );
};

export default SignalList;
