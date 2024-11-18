import React from "react";


import MarketSection from "../section/Market";
import SignalSection from "../section/Signal";
import StrategiesPage from "../components/strategies/page";

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <MarketSection />
      <SignalSection />
      <StrategiesPage />
    </div>
  );
}
