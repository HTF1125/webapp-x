"use client";

import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export interface InsightSource {
  _id: string;
  url: string;
  name: string | null;
  frequency: string | null;
  last_visited: string | null;
  remark: string | null;
}

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "";

/** FETCH - read all sources */
async function fetchInsightSources(): Promise<InsightSource[]> {
  try {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/insightsources`);
    if (!response.ok) throw new Error("Failed to fetch insight sources.");
    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/** Format date/time for the source's last visited property */
const formatLastVisited = (date: string | null) => {
  if (!date) return "Never Visited";
  const lastVisited = new Date(date);
  return `${lastVisited.toLocaleDateString()} ${lastVisited.toLocaleTimeString()}`;
};

const SourceList: React.FC = () => {
  const [sources, setSources] = useState<InsightSource[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);

  /** Load sources when the component mounts */
  useEffect(() => {
    fetchInsightSources()
      .then((fetchedSources) => {
        const sortedSources = fetchedSources.sort((a, b) => {
          const dateA = a.last_visited ? new Date(a.last_visited).getTime() : 0;
          const dateB = b.last_visited ? new Date(b.last_visited).getTime() : 0;
          return dateA - dateB;
        });
        setSources(sortedSources);
      })
      .catch(console.error);
  }, []);

  // Get current page sources
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageSources = sources.slice(startIndex, startIndex + pageSize);

  return (
    <div className="bg-black text-white flex flex-col w-full max-w-lg mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Insight Sources</h2>
          <p className="text-gray-400">Manage your insight sources</p>
        </div>
      </div>

      <ScrollArea className="h-96">
        <div className="space-y-4">
          {currentPageSources.map((source) => (
            <div
              key={source._id}
              className="relative bg-gray-900 p-4 rounded-lg flex flex-col space-y-2 border border-gray-700 hover:bg-gray-800 w-full overflow-hidden"
            >
              <div className="flex items-center space-x-3 truncate">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${source.url}`}
                  alt={source.name || "No name"}
                  className="w-6 h-6 rounded flex-shrink-0"
                />
                <h3
                  className="text-sm font-semibold truncate cursor-pointer text-blue-400 hover:underline flex-1"
                  onClick={() => window.open(source.url, "_blank", "noopener,noreferrer")}
                >
                  {source.name || "Unnamed Source"}
                </h3>
              </div>
              <div className="flex space-x-2">
                <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                  {formatLastVisited(source.last_visited)}
                </Badge>
                {source.frequency && (
                  <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                    {source.frequency}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>
        <span className="text-gray-300">
          Page {currentPage} of {Math.ceil(sources.length / pageSize)}
        </span>
        <button
          className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50"
          disabled={currentPage === Math.ceil(sources.length / pageSize)}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SourceList;
