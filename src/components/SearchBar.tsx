import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";

export const SearchIcon = () => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export const CloseIcon = () => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
    >
      <path
        d="M18 6L6 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M6 6L18 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

interface SearchBarProps {
  searchTerm?: string;
  onSearch: (value: string) => void;
}

export default function SearchBar({ searchTerm = "", onSearch }: SearchBarProps) {
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
    <div className="w-full px-6 py-4 rounded-2xl flex justify-center items-center bg-gradient-to-tr from-indigo-500 to-blue-400 text-white shadow-xl">
      <Input
        type="text"
        value={inputValue}
        onValueChange={handleInputChange}
        onKeyDown={handleKeyDown}
        isClearable
        classNames={{
          label: "text-gray-700/80 dark:text-white/80",
          input: [
            "bg-transparent",
            "text-gray-800 dark:text-white",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
          ],
          innerWrapper: "bg-transparent",
          inputWrapper: [
            "shadow-lg",
            "bg-white/70 dark:bg-gray-800/60",
            "backdrop-blur-md",
            "backdrop-saturate-200",
            "hover:bg-white/90 dark:hover:bg-gray-800/70",
            "group-data-[focus=true]:bg-white/80 dark:group-data-[focus=true]:bg-gray-800/50",
            "!cursor-text",
          ],
        }}
        label="Search"
        placeholder="Search here..."
        radius="lg"
        size="lg"
        startContent={
          <SearchIcon/>
        }
        endContent={
          inputValue && (
            <Button
              isIconOnly
              variant="ghost"
              aria-label="Clear search"
              className="text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              onPress={handleClearSearch}
            >
              <CloseIcon />
            </Button>
          )
        }
      />
      <Button
        isIconOnly
        aria-label="Search"
        onPress={handleSearchButtonClick}
        className="ml-2 bg-blue-600 dark:bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all"
      >
        <SearchIcon />
      </Button>
    </div>
  );
}
