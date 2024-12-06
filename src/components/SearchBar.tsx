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
    <div ref={containerRef} className="relative w-full">
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
        className="w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
      />

      {/* Dropdown with Ticker Suggestions */}
      {isDropdownVisible && (
        <div className="absolute top-full mt-1 w-full bg-gray-700 text-white rounded-md shadow-lg z-10 max-h-52 overflow-y-auto">

          {snippets.map((ticker) => (
            <div
              key={ticker.code}
              className="px-3 py-1 hover:bg-gray-600 cursor-pointer"
              onClick={() => handleSelectTicker(ticker.code)}
            >
              <span className="font-small">{ticker.code}</span>
              {ticker.name && (
                <span className="text-gray-400 truncate ml-2">
                  ({ticker.name})
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
