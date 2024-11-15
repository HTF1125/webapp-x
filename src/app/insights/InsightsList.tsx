// app/insights/components/InsightsList.tsx

"use client";

import { useState, useEffect } from "react";
import InsightCard from "./InsightCard";

interface Insight {
  _id: string;
  title: string;
  date: string;
  content: string;
  tags: string[];
}

interface InsightsListProps {
  initialInsights: Insight[];
}

const InsightsList: React.FC<InsightsListProps> = ({ initialInsights }) => {
  const [insights] = useState<Insight[]>(initialInsights);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}
      {insights.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No insights available. Add a new insight to get started!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((insight) => (
            <InsightCard key={insight._id} insight={insight} />
          ))}
        </div>
      )}
    </div>
  );
};

export default InsightsList;
