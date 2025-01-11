import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { SearchIcon, CloseIcon } from "@nextui-org/shared-icons";

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
        <Input
          type="text"
          placeholder="Search..."
          value={inputValue}
          onValueChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          size="lg"
          endContent={
            inputValue && (
              <Button
                isIconOnly
                variant="light"
                onPress={handleClearSearch}
                aria-label="Clear search"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <CloseIcon />
              </Button>
            )
          }
        />
        <Button
          isIconOnly
          color="primary"
          onPress={handleSearchButtonClick}
          aria-label="Search"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
        >
          <SearchIcon />
        </Button>
      </div>
    </div>
  );
}
