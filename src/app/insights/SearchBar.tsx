"use client";

import React, { useState, useEffect, useRef } from "react";

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
    setInputValue(snippet); // Update the React state with the selected snippet

    // Manually update the form's input value to ensure it reflects the selected snippet
    const formInput = formRef.current?.querySelector('input[name="search"]');
    if (formInput) {
      (formInput as HTMLInputElement).value = snippet; // Update the actual input element
    }

    setFilteredSuggestions([]); // Clear suggestions
    setShowSuggestions(false); // Hide suggestions
  
    // Trigger form submission
    formRef.current?.submit();
  };


  const handleClearSearch = () => {
    setInputValue(""); // Clear the input field
    setFilteredSuggestions([]); // Clear suggestions
    setShowSuggestions(false); // Hide suggestions

    // Manually update the form's input value to ensure it stays cleared
    const formInput = formRef.current?.querySelector('input[name="search"]');
    if (formInput) {
      (formInput as HTMLInputElement).value = ""; // Clear the actual input element
    }

    // Trigger search with cleared input
    formRef.current?.submit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission
      formRef.current?.submit(); // Trigger programmatic submission
    }
  };

  const handleMouseLeave = () => {
    setShowSuggestions(false); // Hide suggestions when mouse leaves
  };

  return (
    <form
      ref={formRef}
      method="GET"
      action=""
      className="flex w-full max-w-xl relative"
    >
      <div className="relative flex-grow" onMouseLeave={handleMouseLeave}>
        <input
          type="text"
          name="search"
          placeholder="Search..."
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
          >
            ✖
          </button>
        )}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul
            className="absolute top-full left-0 w-full bg-gray-900 border border-gray-700 rounded-lg z-10 max-h-48 overflow-y-auto"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-800 cursor-pointer"
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
      <button
        type="submit"
        className="ml-3 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition focus:outline-none"
      >
        Search
      </button>
    </form>
  );
}
