'use client';

import React, { useState } from 'react';
import { callDailyTask } from '@/services/taskApi';

export default function RefreshButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const result = await callDailyTask();
      console.log(result.message);
      // You might want to add some feedback here, like a toast notification
    } catch (error) {
      console.error("Error triggering daily task:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleRefresh}
      className={`p-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 focus:outline-none transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label="Refresh data"
      disabled={isLoading}
    >
      <span className="sr-only">Refresh data</span>
      {isLoading ? (
        // Add a loading spinner or text here
        <span>Loading...</span>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
}
