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
    <div className="w-full flex flex-col items-center space-y-4 px-4">
      <Section header="Insights" className="w-full max-w-3xl">
        <div className="mb-6">
          <SearchBar
            searchTerm={searchTerm}
            suggestions={insights.map((insight) => ({
              name: insight.name,
              issuer: insight.issuer,
              date: new Date(insight.published_date)
                .toISOString()
                .split("T")[0], // Convert to YYYY-MM-DD
            }))}
            filterBy={["name", "issuer", "date"]}
            displayAttributes={["issuer", "name", "date"]}
          />
        </div>

        {/* Insights List */}
        <div className="flex flex-col space-y-2 overflow-y-auto max-h-[70vh] px-4">
          {insights.length === 0 ? (
            <div className="flex items-center justify-center text-center py-4">
              <p className="text-gray-400 text-sm">
                No insights found matching your search.
              </p>
            </div>
          ) : (
            insights.map((insight) => (
              <div key={insight._id} className="flex-shrink-0">
                <InsightCard insight={insight} />
              </div>
            ))
          )}
        </div>
      </Section>
    </div>
  );
}
