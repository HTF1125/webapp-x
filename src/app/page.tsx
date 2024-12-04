import React, { Suspense } from "react";
import MarketSection from "../section/Market";
import SignalSection from "../section/Signal";
import StrategiesPage from "../components/strategies/page";
import LoadingSpinner from "../components/common/LoadingSpinner";
import SearchBar from "@/components/SearchBar";
import { fetchAllTickers, TickerInfo } from "@/api/all";
import { fetchResearchFileCodes } from "@/api/all";
import ResearchFilesList from "@/components/ResearchFiles";
import Section from "@/components/Section";

export default async function App() {
  // Fetch data server-side
  const tickers: TickerInfo[] = await fetchAllTickers();
  const researchFiles: string[] = await fetchResearchFileCodes();

  return (
    <div className="flex flex-col items-center gap-4 p-4 min-h-screen text-white">
      <div className="w-full max-w-3xl py-2">
        <SearchBar tickers={tickers} />
      </div>

      {/* Flex container for side-by-side layout */}
      <div className="p-2 w-full">
        {" "}
        {/* Reduced outer padding */}
        <div className="flex flex-row items-start justify-between w-full gap-4">
          {/* Market Section */}
          <div className="flex-1">
            <Suspense fallback={<LoadingSpinner />}>
              <MarketSection />
            </Suspense>
          </div>

          {/* Research Files Section */}
          <div className="flex-1 max-w-lg h-full">
            <Section header="Research">
              <ResearchFilesList researchFiles={researchFiles} />
            </Section>
          </div>
        </div>{" "}
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <SignalSection />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <StrategiesPage />
      </Suspense>
    </div>
  );
}
