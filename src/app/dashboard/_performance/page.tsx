"use server";

import React from "react";
import { PerformanceGrouped } from "./types";
import ClientPerformancePage from "./ClientPerformance";
import { NEXT_PUBLIC_API_URL } from "@/config";

// Function to fetch performance data
async function fetchPerformanceGrouped(): Promise<PerformanceGrouped[]> {
  const endpoint = new URL("/api/performances-grouped", NEXT_PUBLIC_API_URL);

  try {
    const response = await fetch(endpoint.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Failed to fetch index groups.");
    }

    const data = await response.json();
    return data; // Return the data directly
  } catch (error) {
    console.error("Error fetching performance data:", error);
    throw error;
  }
}

const PerformancePage = async () => {
  try {
    const performanceGrouped = await fetchPerformanceGrouped();
    return <ClientPerformancePage performanceGrouped={performanceGrouped} />;
  } catch (error) {
    // Render error state or fallback UI
    console.error("Error rendering PerformancePage:", error);
    return (
      <div className="error-message">
        <p>Failed to load performance data. Please try again later.</p>
      </div>
    );
  }
};

export default PerformancePage;
