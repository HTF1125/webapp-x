// app/insights/InsightsList.tsx

"use client"; // This makes the component a client component

import Link from "next/link";
import { useState } from "react";
import { InsightHeader } from "./types";
import { useTheme } from "next-themes";

interface InsightsListProps {
  insightHeaders: InsightHeader[];
}

const InsightsList: React.FC<InsightsListProps> = ({ insightHeaders }) => {
  const [error] = useState<string | null>(null);
  const { theme } = useTheme();

  if (error) {
    return (
      <div className="text-red-500 text-center mt-8">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {insightHeaders.map((header) => (
        <Link href={`/insights/${header._id}`} key={header._id}>
          <div
            className={`block shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 transform hover:-translate-y-1 ${
              theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          >
            <p className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              {header.date}
            </p>
            <h2 className={`text-xl font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-black"}`}>
              {header.title}
            </h2>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default InsightsList;
