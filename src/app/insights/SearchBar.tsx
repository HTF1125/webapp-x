"use client";

import React, { useState } from "react";

export default function SearchBar({ searchTerm }: { searchTerm: string }) {
  const [inputValue, setInputValue] = useState(searchTerm);

  const handleClearAndSubmit = (form: HTMLFormElement | null) => {
    setInputValue(""); // Clear the input
    if (form) {
      const inputField = form.querySelector('input[name="search"]') as HTMLInputElement;
      if (inputField) {
        inputField.value = ""; // Ensure the input's value is cleared
      }
      form.submit(); // Submit the form programmatically
    }
  };

  return (
    <form method="GET" action="" className="flex w-full max-w-xl relative">
      <div className="relative flex-grow">
        <input
          type="text"
          name="search"
          placeholder="Search insights..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {inputValue && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault(); // Prevent the default button behavior
              handleClearAndSubmit(e.currentTarget.closest("form"));
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
          >
            ✖
          </button>
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
