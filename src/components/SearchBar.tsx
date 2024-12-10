"use client";

import { useState, useEffect, useRef } from "react";
import { TickerInfo } from "@/api/all";

export default function SearchBar({ tickers }: { tickers: TickerInfo[] }) {
  const [searchQuery, setSearchQuery] = useState<string>(""); // User's search input
  const [snippets, setSnippets] = useState<TickerInfo[]>(tickers); // Initialize with full list
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false); // Dropdown visibility
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSearch = (query: string) => {
    const filtered = query
      ? tickers.filter(
          (ticker) =>
            ticker.code.toLowerCase().includes(query.toLowerCase()) ||
            (ticker.name &&
              ticker.name.toLowerCase().includes(query.toLowerCase()))
        )
      : tickers; // Show full list when query is empty
    setSnippets(filtered);
  };

  const handleSelectTicker = (tickerCode: string) => {
    setSearchQuery(tickerCode); // Set selected ticker in input
    setIsDropdownVisible(false); // Close dropdown
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsDropdownVisible(false); // Close dropdown when clicking outside
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search tickers..."
        value={searchQuery}
        onFocus={() => setIsDropdownVisible(true)} // Show dropdown on focus
        onChange={(e) => {
          setSearchQuery(e.target.value); // Update search query
          handleSearch(e.target.value); // Filter results
        }}
        className="w-full p-1 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white text-sm"
      />

      {/* Dropdown with Ticker Suggestions */}
      {isDropdownVisible && (
        <div className="absolute top-full mt-1 w-full bg-gray-700 text-white rounded-md shadow-lg z-10 max-h-44 overflow-y-auto">
          {snippets.length > 0 ? (
            snippets.map((ticker) => (
              <div
                key={ticker.code}
                className="px-2 py-1 hover:bg-gray-600 cursor-pointer text-sm flex justify-between"
                onClick={() => handleSelectTicker(ticker.code)}
              >
                <span className="truncate">{ticker.code}</span>
                {ticker.name && (
                  <span className="text-gray-400 truncate ml-2">
                    ({ticker.name})
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-400 text-sm">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
