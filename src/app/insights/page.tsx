// app/insights/page.tsx

import Link from "next/link";
import InsightCard from "./InsightCard";

interface Insight {
  _id: string;
  title: string;
  date: string;
  content: string;
  tags: string[];
}

export const dynamic = "force-dynamic"; // Ensure dynamic rendering

export default async function InsightsPage() {
  let insights: Insight[] = [];

  try {
    // Fetch insights from the API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/data/insights`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store", // Disable caching for dynamic content
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch insights");
    }

    insights = await response.json();
  } catch (error) {
    console.error("Error fetching insights:", error);
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
          Insights
        </h1>
        <Link
          href="/insights/add"
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          + New
        </Link>
      </header>
      {insights.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((insight) => (
            <InsightCard key={insight._id} insight={insight} />
          ))}
        </div>
      ) : (
        <p className="text-center text-red-500">
          Unable to load insights. Please try again later.
        </p>
      )}
    </div>
  );
}
