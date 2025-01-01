"use server";

import React from "react";
import { PerformanceGrouped } from "./types";
import ClientPerformancePage from "./ClientPerformance";

async function fetchPerformanceGrouped(): Promise<PerformanceGrouped[]> {
  try {
    const response = await fetch(
      "http://localhost:3000/api/performance-grouped",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data: PerformanceGrouped[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching index group performances:", error);
    throw error;
  }
}

const PerformancePage = async () => {
  const performanceGrouped = await fetchPerformanceGrouped();

  return <ClientPerformancePage performanceGrouped={performanceGrouped} />;
};

export default PerformancePage;
