import React from "react";
import PerformancePage from "./performance/PerformancePage";
import PredictionPage from "./prediction/page";
import RefreshButton from "./TaskButton";

export default function DashboardPage() {
  return (
    <div className="w-full flex flex-col items-center space-y-4 relative">
      <div className="absolute top-4 right-4">
        <RefreshButton></RefreshButton>
        <span className="sr-only">Refresh data</span>
      </div>

      <section className="w-full">
        <PerformancePage />
      </section>
      <section className="w-full">
        <PredictionPage />
      </section>
    </div>
  );
}
