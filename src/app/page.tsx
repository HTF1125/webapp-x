import React, { Suspense } from "react";
import MarketSection from "../section/Market";
import SignalSection from "../section/Signal";
import StrategiesPage from "../components/strategies/page";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function App() {
  return (
    <div className="flex flex-col justify-center">
      <Suspense fallback={<LoadingSpinner />}>
        <MarketSection />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <SignalSection />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <StrategiesPage />
      </Suspense>
    </div>
  );
}
