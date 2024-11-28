import React from "react";

const ScaleToggle: React.FC<{
  isLogScale: boolean;
  setIsLogScale: (isLog: boolean) => void;
}> = ({ isLogScale, setIsLogScale }) => (
  <div className="w-full sm:w-auto">
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Scale:</p>
    <div className="flex gap-2">
      <button
        onClick={() => setIsLogScale(true)}
        className={`px-3 py-1 text-sm rounded transition-colors ${
          isLogScale
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        }`}
      >
        Log
      </button>
      <button
        onClick={() => setIsLogScale(false)}
        className={`px-3 py-1 text-sm rounded transition-colors ${
          !isLogScale
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        }`}
      >
        Linear
      </button>
    </div>
  </div>
);

export default ScaleToggle;
