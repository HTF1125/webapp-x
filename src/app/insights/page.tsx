"use client";

import React from "react";
import AllInsights from "./AllInsights";
import InsightsProvider from "./provider";



const InsightPage = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-6">
      <InsightsProvider>
        <AllInsights />
      </InsightsProvider>
    </div>
  );
};

export default InsightPage;
