import React from "react";
import { fetchStrategyPerformance, fetchStrategiesSummary } from "../api";
import { StrategyDetails } from "./StrategyClient";

interface PageProps {
  params: { code: string };
}

export async function generateStaticParams() {
  const strategiesSummary = await fetchStrategiesSummary();
  return strategiesSummary.map((strategy) => ({
    code: strategy.code,
  }));
}

export default async function StrategyPage({ params }: PageProps) {
  const performanceData = await fetchStrategyPerformance(params.code);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Strategy: {params.code}</h1>
      <StrategyDetails
        performanceData={performanceData}
        strategyCode={params.code}
      />
    </div>
  );
}
