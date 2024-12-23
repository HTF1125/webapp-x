// src/components/SearchBar.tsx

"use client";

import React, { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

interface SearchBarProps {
  searchTerm?: string;
  onSearch: (value: string) => void;
}

export default function SearchBar({
  searchTerm = "",
  onSearch,
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(searchTerm);

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleClearSearch = () => {
    setInputValue("");
    onSearch("");
  };

  const handleSearchButtonClick = () => {
    onSearch(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch(inputValue);
    }
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full max-w-2xl relative">
        <input
          type="text"
          placeholder="Search..."
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-4 pr-16 rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClearSearch}
            aria-label="Clear search"
            className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none transition-colors"
          >
            <FaTimes />
          </button>
        )}
        <button
          type="button"
          onClick={handleSearchButtonClick}
          aria-label="Search"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition focus:outline-none"
        >
          <FaSearch />
        </button>
      </div>
    </div>
  );
}
