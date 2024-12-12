"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes } from 'react-icons/fa'; // Import icons

interface Suggestion {
  [key: string]: string;
}

interface SearchBarProps {
  searchTerm: string;
  suggestions: Suggestion[];
  filterBy: string[];
  displayAttributes: string[];
}

export default function SearchBar({
  searchTerm,
  suggestions,
  filterBy,
  displayAttributes,
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(searchTerm);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setFilteredSuggestions(suggestions);
  }, [suggestions]);

  const handleInputChange = (value: string) => {
    setInputValue(value);

    if (value) {
      setShowSuggestions(true);
      setFilteredSuggestions(
        suggestions.filter((suggestion) =>
          filterBy.some((key) =>
            suggestion[key]?.toLowerCase().includes(value.toLowerCase())
          )
        )
      );
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions(suggestions);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    const snippet = filterBy
      .map((key) => `${suggestion[key]}`)
      .join(" ");
    setInputValue(snippet);

    const formInput = formRef.current?.querySelector('input[name="search"]');
    if (formInput) {
      (formInput as HTMLInputElement).value = snippet;
    }

    setFilteredSuggestions([]);
    setShowSuggestions(false);
    formRef.current?.submit();
  };

  const handleClearSearch = () => {
    setInputValue("");
    setFilteredSuggestions([]);
    setShowSuggestions(false);

    const formInput = formRef.current?.querySelector('input[name="search"]');
    if (formInput) {
      (formInput as HTMLInputElement).value = "";
    }

    formRef.current?.submit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      formRef.current?.submit();
    }
  };

  const handleMouseLeave = () => {
    setShowSuggestions(false);
  };

  return (
    <div className="flex justify-center items-center w-full">
      <form
        ref={formRef}
        method="GET"
        action=""
        className="w-full max-w-2xl relative"
      >
        <div className="relative flex-grow" onMouseLeave={handleMouseLeave}>
          <input
            type="text"
            name="search"
            placeholder="Search..."
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-4 pr-24 rounded-full border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition focus:outline-none"
          >
            <FaSearch />
          </button>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <ul
              className="absolute top-full left-0 w-full bg-gray-900 border border-gray-700 rounded-lg z-10 max-h-48 overflow-y-auto mt-1"
            >
              {filteredSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-3 hover:bg-gray-800 cursor-pointer"
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
      </form>
    </div>
  );
}
