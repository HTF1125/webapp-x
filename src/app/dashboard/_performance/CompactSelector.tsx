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
    <div className="inline-flex flex-wrap items-left gap-2  p-2 rounded-lg shadow-lg">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-sm transition-all duration-200 ease-in-out ${
            current === option
              ? " text-white shadow-md ring-2 ring-blue-400 ring-opacity-50"
              : " text-white hover:bg-white hover:text-white"
          }`}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default CompactSelector;
