// /dashboard/page.tsx

import React from "react";
import { PerformancePage } from "./_performance/page";
import { PerformanceGrouped } from "./_performance/types";
import SignalSection from "./_signal/page";

export default async function DashboardPage() {
  // Fetch data on the server side

  async function fetchPerofrmanceGrouped(): Promise<PerformanceGrouped[]> {
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

  const performanceGrouped = await fetchPerofrmanceGrouped();

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="w-full box-border">
        <PerformancePage performanceGrouped={performanceGrouped} />
      </div>

      <div className="w-full box-border">
        <SignalSection />
      </div>
    </div>
  );
}
