import React from "react";

interface CompactSelectorProps {
  current: string;
  options: string[];
  onSelect: (value: string) => void;
}

const CompactSelector: React.FC<CompactSelectorProps> = ({
  current,
  options,
  onSelect,
}) => {
  return (
    <div className="flex flex-wrap gap-1 bg-gray-900 p-1 rounded-lg shadow-md overflow-auto">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className={`px-2 py-1 text-sm font-medium rounded-md transition-all duration-150 ease-in-out ${
            current === option
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
          }`}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default CompactSelector;
