// /dashboard/page.tsx

import React from "react";
import PerformancePage from "./performance/PerformancePage";
import { PeriodProvider } from "./performance/PeriodProvider";
import PredictionPage from "./prediction/page";

export default async function DashboardPage() {
  // Fetch data on the server side

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="w-full box-border">
        <PeriodProvider>
          <PerformancePage />
        </PeriodProvider>
      </div>

      <div className="w-full box-border">
        <PredictionPage />
      </div>
    </div>
  );
}
