import React, { Suspense } from "react";
import MarketSection from "../section/Market";
import SignalSection from "../section/Signal";
import StrategiesPage from "../components/strategies/page";
import LoadingSpinner from "../components/common/LoadingSpinner";
import SearchBar from "@/components/SearchBar";
import { fetchAllTickers, TickerInfo } from "@/api/all";
import { fetchResearchFileCodes } from "@/api/all";
import ResearchFilesList from "@/components/ResearchFiles";

export default async function App() {
  // Fetch data server-side
  const tickers: TickerInfo[] = await fetchAllTickers();
  const researchFiles: string[] = await fetchResearchFileCodes();


  return (
    <div className="flex flex-col items-center gap-2 p-2 min-h-screen text-white">
      <div className="w-full max-w-3xl py-2">
        <SearchBar tickers={tickers} />
      </div>

      <div>
        <ResearchFilesList researchFiles={researchFiles} />
      </div>

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
