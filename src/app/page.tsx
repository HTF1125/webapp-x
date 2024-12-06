import React, { Suspense } from "react";
import MarketSection from "../section/Market";
import SignalSection from "../section/Signal";
import StrategiesPage from "../components/strategies/page";
import LoadingSpinner from "../components/common/LoadingSpinner";

// Data fetching happens directly in the component
export default async function App() {
  // Fetch data at runtime

  return (
    <div>
      <div className="w-full">
        <Suspense fallback={<LoadingSpinner />}>
          <MarketSection />
        </Suspense>
      </div>
      {/* Signal Section */}
      <div className="w-full">
        <Suspense fallback={<LoadingSpinner />}>
          <SignalSection />
        </Suspense>
      </div>

      {/* Strategies Section */}
      <div className="w-full">
        <Suspense fallback={<LoadingSpinner />}>
          <StrategiesPage />
        </Suspense>
      </div>
    </div>
  );
}
