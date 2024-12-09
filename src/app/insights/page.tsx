import React from "react";
import Section from "@/components/Section";
import InsightCard from "./InsightCard";
import SearchBar from "./SearchBar";
import Insight from "@/api/all";
import { fetchInsights } from "./api";

export default async function Page({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const searchTerm = searchParams?.search || "";
  let insights: Insight[] = [];

  try {
    insights = await fetchInsights(searchTerm);
  } catch (error: any) {
    console.error("Error loading insights:", error.message);
  }

  return (
    <div className="w-full flex flex-col space-y-4">
      <Section header="Insights">
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar searchTerm={searchTerm} />
        </div>

        {/* Insights List */}
        <div
          className="flex flex-col space-y-2 overflow-y-auto"
          style={{ height: "calc(100vh - 250px)" }}
        >
          {insights.length === 0 ? (
            <div className="flex items-center justify-center text-center py-4">
              <p className="text-gray-400 text-sm">
                No insights found matching your search.
              </p>
            </div>
          ) : (
            insights.map((insight) => (
              <InsightCard key={insight._id} insight={insight} />
            ))
          )}
        </div>
      </Section>
    </div>
  );
}
