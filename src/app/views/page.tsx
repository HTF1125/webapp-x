"use client";

import React, { useState, useEffect } from "react";
import { NEXT_PUBLIC_API_URL } from "@/config";
import { motion } from "framer-motion";
import { FaChartLine, FaLightbulb, FaChartPie, FaRocket, FaExclamationTriangle } from "react-icons/fa";

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
  const endpoint = `${NEXT_PUBLIC_API_URL}/api/data/insights/tacticalview`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
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
  const [activeSection, setActiveSection] = useState<string>("Global Economic Outlook");

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
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-t-4 border-blue-500 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-red-500">
        <h1>Error: {error}</h1>
      </div>
    );
  }

  const { views, published_date } = tacticalViewData!;

  const sections = [
    { title: "Global Economic Outlook", icon: FaChartLine },
    { title: "Key Investment Themes", icon: FaLightbulb },
    { title: "Asset Class Views", icon: FaChartPie },
    { title: "Top Tactical Ideas", icon: FaRocket },
    { title: "Key Risks", icon: FaExclamationTriangle },
  ];

  return (
    <div className="p-6 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mb-8"
        >
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">Tactical View Report</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Published: {formatDate(published_date)}</p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8">
          <motion.nav
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:w-1/4"
          >
            <ul className="space-y-2">
              {sections.map((section) => (
                <li key={section.title}>
                  <button
                    onClick={() => setActiveSection(section.title)}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-2 ${
                      activeSection === section.title
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    <span>{section.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.nav>

          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:w-3/4"
          >
            {activeSection === "Global Economic Outlook" && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Global Economic Outlook</h2>
                <p className="text-lg text-gray-700 dark:text-gray-300">{views["Global Economic Outlook"]}</p>
              </div>
            )}

            {activeSection === "Key Investment Themes" && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Key Investment Themes</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  {views["Key Investment Themes"].map((theme, index) => (
                    <li key={index} className="text-lg">{theme}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeSection === "Asset Class Views" && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Asset Class Views</h2>
                {Object.entries(views["Asset Class Views"]).map(([category, data]) => (
                  <div key={category} className="mb-6">
                    <h3 className="text-2xl font-medium mb-2 text-gray-800 dark:text-gray-200">{category}</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                          <tr>
                            <th className="px-4 py-2 text-gray-800 dark:text-gray-200">Region / Sector</th>
                            <th className="px-4 py-2 text-gray-800 dark:text-gray-200">View</th>
                            <th className="px-4 py-2 text-gray-800 dark:text-gray-200">Rationale</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(data).map(([key, value]) => {
                            const viewRationale = value as ViewRationale | undefined;
                            return (
                              <tr key={key} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="border-t border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">{key}</td>
                                <td className="border-t border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">{viewRationale?.view}</td>
                                <td className="border-t border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">{viewRationale?.rationale}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === "Top Tactical Ideas" && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Top Tactical Ideas</h2>
                <ul className="space-y-4">
                  {views["Top Tactical Ideas"].map((idea, index) => (
                    <li key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{idea.idea}</h3>
                      <p className="text-gray-700 dark:text-gray-300">{idea.rationale}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeSection === "Key Risks" && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Key Risks</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  {views["Key Risks"].map((risk, index) => (
                    <li key={index} className="text-lg">{risk}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
