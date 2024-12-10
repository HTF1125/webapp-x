import React, { Suspense } from "react";
import PeriodSelector from "@/components/dashboard/PeriodSelector";
import MarketCharts from "@/components/MarketCharts";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { PeriodProvider } from "@/components/dashboard/PeriodContext";
import Section from "@/components/Section";
import { fetchAllIndexGroupPerformances } from "@/api/all";

export default function MarketSection() {
  const allIndexGroupPerformances = React.use(fetchAllIndexGroupPerformances());

  return (
    <PeriodProvider>
      <Section header="Market">
        {/* Header and Period Selector */}
        <div className="flex justify-between items-center mb-6">
          <Suspense fallback={<LoadingSpinner />}>
            <PeriodSelector />
          </Suspense>
        </div>

        {/* Market Charts */}
        <div className="w-full">
          <Suspense fallback={<LoadingSpinner />}>
            <MarketCharts allIndexGroupPerformances={allIndexGroupPerformances} />
          </Suspense>
        </div>  
      </Section>
    </PeriodProvider>
  );
}
