"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

interface Suggestion {
  [key: string]: string;
}

interface SearchBarProps {
  searchTerm: string;
  suggestions: Suggestion[];
  filterBy: string[]; // Keys to filter suggestions
  displayAttributes: string[]; // Keys to display in the dropdown
  onSearch: (value: string) => void; // Callback for search
}

export default function SearchBar({
  searchTerm,
  suggestions,
  filterBy,
  displayAttributes,
  onSearch,
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(searchTerm);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1); // Tracks the highlighted suggestion

  // Ref to store the debounce timeout
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (inputValue) {
      setShowSuggestions(true);
      const filtered = suggestions.filter((suggestion) =>
        filterBy.some((key) =>
          suggestion[key]?.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
      setFilteredSuggestions(filtered);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  }, [inputValue, suggestions, filterBy]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setActiveIndex(-1); // Reset active suggestion index

    // Clear the previous debounce timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set a new debounce timeout
    debounceTimeout.current = setTimeout(() => {
      onSearch(value); // Trigger the parent search logic
    }, 300); // Debounce delay of 300ms
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    const snippet = displayAttributes
      .map((key) => suggestion[key])
      .filter(Boolean)
      .join(" - ");
    setInputValue(snippet);
    setShowSuggestions(false);

    // Trigger search with the selected suggestion
    onSearch(snippet);
  };

  const handleClearSearch = () => {
    setInputValue("");
    setFilteredSuggestions([]);
    setShowSuggestions(false);

    // Notify parent of cleared search
    onSearch("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && filteredSuggestions[activeIndex]) {
        handleSuggestionClick(filteredSuggestions[activeIndex]);
      } else {
        onSearch(inputValue); // Trigger search for current input
        setShowSuggestions(false);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleFocus = () => setShowSuggestions(true);

  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full max-w-2xl relative">
        <div className="relative flex-grow">
          <input
            type="text"
            name="search"
            placeholder="Search..."
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            className="w-full p-4 pr-16 rounded-full border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
            >
              <FaTimes />
            </button>
          )}
          <button
            type="button"
            onClick={() => onSearch(inputValue)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition focus:outline-none"
          >
            <FaSearch />
          </button>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-gray-900 border border-gray-700 rounded-lg z-10 max-h-48 overflow-y-auto mt-1 shadow-lg">
              {filteredSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className={`p-3 hover:bg-gray-800 cursor-pointer ${
                    activeIndex === index ? "bg-gray-700" : ""
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {displayAttributes
                    .map((attr) => suggestion[attr])
                    .filter(Boolean)
                    .join(" - ")}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
