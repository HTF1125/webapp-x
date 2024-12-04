"use client";

import { useState, useEffect, useRef } from "react";
import { TickerInfo } from "@/api/all";

export default function SearchBar({ tickers }: { tickers: TickerInfo[] }) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [snippets, setSnippets] = useState<TickerInfo[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSnippets(tickers); // Show all tickers when no query is entered
      return;
    }

    const filtered = tickers.filter(
      (ticker) =>
        ticker.code.toLowerCase().includes(query.toLowerCase()) ||
        (ticker.name && ticker.name.toLowerCase().includes(query.toLowerCase()))
    );
    setSnippets(filtered);
  };

  const handleToggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
    if (!isDropdownVisible && !searchQuery.trim()) {
      // Populate snippets with all tickers if the dropdown becomes visible
      setSnippets(tickers);
    }
  };

  const handleSelectTicker = (tickerCode: string) => {
    setSearchQuery(tickerCode); // Set selected ticker in the input field
    setIsDropdownVisible(false); // Hide the dropdown
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsDropdownVisible(false); // Hide dropdown when clicking outside
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative flex flex-col items-center w-full">
      {/* Compact Search Input */}
      <input
        type="text"
        placeholder="Select a ticker..."
        value={searchQuery}
        onClick={handleToggleDropdown} // Toggle dropdown on click
        onChange={(e) => {
          setSearchQuery(e.target.value);
          handleSearch(e.target.value);
        }}
        className="w-full max-w-md p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white text-sm"
      />

      {/* Compact Dropdown Snippets */}
      {isDropdownVisible && snippets.length > 0 && (
        <div
          className="absolute top-full mt-1 w-full max-w-md bg-gray-700 text-white rounded-md shadow-lg z-10 overflow-y-auto"
          style={{ maxHeight: "200px" }} // Scrollable dropdown
        >
          {snippets.map((ticker) => (
            <div
              key={ticker.code}
              className="px-3 py-2 hover:bg-gray-600 cursor-pointer text-sm"
              onClick={() => handleSelectTicker(ticker.code)}
            >
              <span className="font-medium">{ticker.code}</span>
              {ticker.name && <span className="text-gray-400 truncate ml-2">({ticker.name})</span>}
            </div>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {isDropdownVisible && !snippets.length && (
        <p className="text-gray-500 mt-1 text-sm">No results found.</p>
      )}
    </div>
  );
}
