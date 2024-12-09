import React, { Suspense } from "react";
import MarketSection from "../section/Market";
import SignalSection from "../section/Signal";
import StrategiesPage from "../components/strategies/page";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default async function App() {
  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Market Section */}
      <div className="w-full box-border">
        <Suspense fallback={<LoadingSpinner />}>
          <MarketSection />
        </Suspense>
      </div>

      {/* Signal Section */}
      <div className="w-full box-border">
        <Suspense fallback={<LoadingSpinner />}>
          <SignalSection />
        </Suspense>
      </div>

      {/* Strategies Section */}
      <div className="w-full box-border">
        <Suspense fallback={<LoadingSpinner />}>
          <StrategiesPage />
        </Suspense>
      </div>
    </div>
  );
}
