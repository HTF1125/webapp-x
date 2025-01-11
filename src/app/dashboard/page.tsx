import React, { Suspense } from "react";

const PerformancePage = React.lazy(() => import("./performance/PerformancePage"));
const PredictionPage = React.lazy(() => import("./prediction/page"));

export default function DashboardPage() {
  return (
    <div className="w-full items-center flex flex-col space-y-4">
      <Suspense fallback={<div className="text-center text-gray-500">Loading Performance...</div>}>
        <div className="w-full box-border">
          <PerformancePage />
        </div>
      </Suspense>

      <Suspense fallback={<div className="text-center text-gray-500">Loading Predictions...</div>}>
        <div className="w-full box-border">
          <PredictionPage />
        </div>
      </Suspense>
    </div>
  );
}
