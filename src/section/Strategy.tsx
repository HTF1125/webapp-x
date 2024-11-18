"use client";

import React from "react";
import { fetchStrategies } from "@/components/strategies/api";
import StrategyCard from "@/components/StrategyCard";
import Section from "@/components/Section";
import { Strategy } from "@/components/strategies/types";
export const revalidate = 3600;

export default async function StrategySection() {
  const strategies = await fetchStrategies();

  if (!strategies || strategies.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <Section header="Strategies">
          <div className="text-center text-gray-400">No strategies available.</div>
        </Section>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <Section header="Strategies">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {strategies.map((strategy: Strategy) => (
            <StrategyCard
              key={strategy._id}
              strategy={strategy}
              onClick={(strategyId) => console.log(`Navigate to ${strategyId}`)}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
