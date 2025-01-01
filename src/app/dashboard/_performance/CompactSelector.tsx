"use client";

import React from "react";

interface CompactSelectorProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

const CompactSelector: React.FC<CompactSelectorProps> = ({
  options,
  selected,
  onChange,
}) => {
  return (
    <div className="flex flex-wrap gap-2 bg-gray-900 p-2 rounded-lg shadow-md">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ease-in-out
            ${
              selected === option
                ? "bg-white text-black shadow-lg"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default CompactSelector;
