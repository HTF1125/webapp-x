"use client"

import React, { useState, useEffect } from "react";
import { NEXT_PUBLIC_API_URL } from "@/config";

interface ViewRationale {
  view: string;
  rationale: string;
}

interface EquitiesData {
  [key: string]: ViewRationale | undefined;
}

interface AssetClassViews {
  Equities: EquitiesData;
  "Fixed Income": EquitiesData;
  Alternatives: EquitiesData;
}

interface TacticalIdea {
  idea: string;
  rationale: string;
}

interface TacticalViewData {
  views: {
    "Global Economic Outlook": string;
    "Key Investment Themes": string[];
    "Asset Class Views": AssetClassViews;
    "Top Tactical Ideas": TacticalIdea[];
    "Key Risks": string[];
  };
  published_date: string;
}

async function fetchTacticalView(): Promise<TacticalViewData> {
  const endpoint = `${NEXT_PUBLIC_API_URL}api/data/insights/tacticalview`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store", // Ensure fresh data for every request
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch Tactical View data.");
  }

  return response.json();
}

export default function TacticalView() {
  const [tacticalViewData, setTacticalViewData] = useState<TacticalViewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTacticalView = async () => {
      try {
        const data = await fetchTacticalView();
        setTacticalViewData(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadTacticalView();
  }, []);

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date(date));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="spinner"></div> {/* Add a spinner component or style */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-red-500">
        <h1>Error: {error}</h1>
      </div>
    );
  }

  const { views, published_date } = tacticalViewData!;

  return (
      <div className="max-w-4xl mx-auto space-y-6 bg-gray-900 p-6 rounded-lg shadow-xl text-gray-200">
        {/* Report Header */}
        <div className="border-b border-gray-700 pb-6">
          <h1 className="text-4xl font-bold text-gray-100">Tactical View Report</h1>
          <p className="text-gray-400">
            <strong>Published Date:</strong> {formatDate(published_date)}
          </p>
        </div>

        {/* Global Economic Outlook */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-gray-100">Global Economic Outlook</h2>
          <p className="text-lg text-gray-400">{views["Global Economic Outlook"]}</p>
        </section>

        {/* Key Investment Themes */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-gray-100">Key Investment Themes</h2>
          <ul className="list-disc pl-6 space-y-2">
            {views["Key Investment Themes"].map((theme, index) => (
              <li key={index} className="text-lg text-gray-400">{theme}</li>
            ))}
          </ul>
        </section>

        {/* Asset Class Views */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-gray-100">Asset Class Views</h2>
          {Object.entries(views["Asset Class Views"]).map(([category, data]) => (
            <div key={category} className="mb-6">
              <h3 className="text-2xl font-medium text-gray-200">{category}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-gray-700 mt-4">
                  <thead className="bg-gray-800 text-gray-300">
                    <tr>
                      <th className="border border-gray-700 px-6 py-3">Region / Sector</th>
                      <th className="border border-gray-700 px-6 py-3">View</th>
                      <th className="border border-gray-700 px-6 py-3">Rationale</th>
                    </tr>
                  </thead>
                  <tbody className="text-lg">
                    {Object.entries(data).map(([key, value]) => {
                      const viewRationale = value as ViewRationale | undefined;
                      return (
                        <tr key={key} className="hover:bg-gray-800">
                          <td className="border border-gray-700 px-6 py-3">{key}</td>
                          <td className="border border-gray-700 px-6 py-3 text-gray-400">
                            {viewRationale?.view}
                          </td>
                          <td className="border border-gray-700 px-6 py-3 text-gray-400">
                            {viewRationale?.rationale}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>

        {/* Top Tactical Ideas */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-gray-100">Top Tactical Ideas</h2>
          <ul className="list-decimal pl-6 space-y-2">
            {views["Top Tactical Ideas"].map((idea, index) => (
              <li key={index} className="text-lg text-gray-400">
                <strong className="text-gray-200">{idea.idea}</strong>: {idea.rationale}
              </li>
            ))}
          </ul>
        </section>

        {/* Key Risks */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-gray-100">Key Risks</h2>
          <ul className="list-disc pl-6 space-y-2">
            {views["Key Risks"].map((risk, index) => (
              <li key={index} className="text-lg text-gray-400">{risk}</li>
            ))}
          </ul>
        </section>
      </div>
  );
}
