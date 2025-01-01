import React, { Suspense } from "react";
import PeriodSelector from "@/components/dashboard/PeriodSelector";
import MarketCharts from "@/components/MarketCharts";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { PeriodProvider } from "@/components/dashboard/PeriodContext";
import Section from "@/components/Section";
import { fetchAllIndexGroupPerformances } from "@/app/api/all";

export default function MarketSection() {
  const allIndexGroupPerformances = React.use(fetchAllIndexGroupPerformances());

  return (
    <PeriodProvider>
      <Section title="Market">
        {/* Header and Period Selector */}
        <div className="flex justify-between items-center mb-6">
            <PeriodSelector />
        </div>

        {/* Market Charts */}
        <div className="w-full">
            <MarketCharts
              allIndexGroupPerformances={allIndexGroupPerformances}
            />
        </div>
      </Section>
    </PeriodProvider>
  );
}
