// /dashboard/page.tsx

import React from "react";
import PerformancePage from "./performance/PerformancePage";
import { PeriodProvider } from "./performance/PeriodProvider";
import PredictionPage from "./prediction/page";
import MarketCommentaryComponent from "./_commentary/page";
import StrategiesPage from "../strategies/page";
export default async function DashboardPage() {
  // Fetch data on the server side

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="w-full box-border">
        <PeriodProvider>
          <PerformancePage />
        </PeriodProvider>
      </div>

      <div className="w-full box-border flex flex-row gap-4 flex-wrap max-w-5xl mx-auto sm:max-h-80 overflow-auto">
        <div className="flex-1 w-36 overflow-auto min-w-56">
          <MarketCommentaryComponent />
        </div>
        <div className="flex-1 w-36 overflow-auto min-w-56">
          Insights
        </div>
        <div className="flex-1 w-36 overflow-auto min-w-56">
          Views
        </div>
      </div>

      <PredictionPage />
      <div className="max-w-5xl mx-auto ">
        <StrategiesPage />
      </div>

    </div>
  );
}
