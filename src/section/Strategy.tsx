// ./src/section/Strategy.tsx

"use client";

import React from "react";
import { fetchStrategies } from "@/app/strategies/api";
import StrategyCard from "@/components/StrategyCard";
import Section from "@/components/Section";
import { StrategiesKeyInfo } from "@/app/strategies/types";

const StrategiesContent = ({
  strategies,
}: {
  strategies: StrategiesKeyInfo[];
}) => {
  if (!strategies || strategies.length === 0) {
    return (
      <div className="text-center text-gray-400">No strategies available.</div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {strategies.map((strategy: StrategiesKeyInfo) => (
        <StrategyCard
          key={strategy.code}
          strategy={strategy}
          onClick={(strategyId) => console.log(`Navigate to ${strategyId}`)}
        />
      ))}
    </div>
  );
};

export default function StrategySection() {
  const [strategies, setStrategies] = React.useState<StrategiesKeyInfo[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadStrategies = async () => {
      try {
        const fetchedStrategies = await fetchStrategies();
        setStrategies(fetchedStrategies);
      } catch (error) {
        console.error("Failed to fetch strategies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStrategies();
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <Section header="Strategies">
        {loading ? (
          <div className="text-center text-gray-400">Loading strategies...</div>
        ) : (
          <StrategiesContent strategies={strategies} />
        )}
      </Section>
    </div>
  );
}
