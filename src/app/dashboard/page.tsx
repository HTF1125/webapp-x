import React, { Suspense } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const PerformancePage = React.lazy(
  () => import("./performance/PerformancePage")
);
const PredictionPage = React.lazy(() => import("./prediction/page"));

export default function DashboardPage() {
  return (
    <div className="w-full items-center flex flex-col space-y-4">
      <Suspense fallback={<LoadingSpinner className="min-h-400px" />}>
        <div className="w-full box-border">
          <PerformancePage />
        </div>
      </Suspense>
      <Suspense fallback={<LoadingSpinner className="min-h-400px" />}>
        <div className="w-full box-border">
          <PredictionPage />
        </div>
      </Suspense>
    </div>
  );
}
