// src/app/dashboard/_performance/page.tsx (Server-side)
import React from "react";
import { fetchPerformanceGrouped } from "./DataServices";
import PerformancePageClient from "./PerformanceClientPage"; // Import the client-side component

interface PerformancePageProps {
  performanceGrouped: any[];
}

const PerformancePageServer: React.FC<PerformancePageProps> = ({ performanceGrouped }) => {
  return <PerformancePageClient performanceGrouped={performanceGrouped} />;
};

// Fetch the data directly inside the server component
export const fetchPerformanceData = async () => {
  try {
    const performanceGrouped = await fetchPerformanceGrouped();
    return performanceGrouped;
  } catch (error) {
    console.error("Error fetching performance data:", error);
    return []; // Fallback with empty data
  }
};

const PerformancePage = async () => {
  const performanceGrouped = await fetchPerformanceData();

  return <PerformancePageServer performanceGrouped={performanceGrouped} />;
};

export default PerformancePage;
