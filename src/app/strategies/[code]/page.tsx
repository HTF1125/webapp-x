// app/strategies/[code]/page.tsx

import React from "react";
import { Strategy } from "../types";
import { fetchStrategy, fetchStrategiesSummary } from "../api";

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
  const strategy = await fetchStrategy(params.code);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Strategy: {strategy.code}</h1>
      <StrategyDetails strategy={strategy} />
    </div>
  );
}

const StrategyDetails: React.FC<{ strategy: Strategy }> = ({ strategy }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SummarySection strategy={strategy} />
      <BookSection book={strategy.book} />
    </div>
  );
};

const SummarySection: React.FC<{ strategy: Strategy }> = ({ strategy }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-2">Summary</h2>
      <p>Last updated: {strategy.last_updated || "N/A"}</p>
      <p>
        Annual Return:{" "}
        {strategy.ann_return !== null
          ? (strategy.ann_return * 100).toFixed(2)
          : "N/A"}
        %
      </p>
      <p>
        Annual Volatility:{" "}
        {strategy.ann_volatility !== null
          ? (strategy.ann_volatility * 100).toFixed(2)
          : "N/A"}
        %
      </p>
    </div>
  );
};

const BookSection: React.FC<{ book: Strategy["book"] }> = ({ book }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-2">Book Data</h2>
      <div className="space-y-2">
        <DataList title="D" data={book.d} />
        <DataList title="V" data={book.v} />
        <DataList title="L" data={book.l} />
      </div>
    </div>
  );
};

const DataList: React.FC<{ title: string; data: (string | number)[] }> = ({
  title,
  data,
}) => (
  <div>
    <h3 className="font-medium">{title}:</h3>
    <ul className="list-disc list-inside">
      {data.slice(0, 10).map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
    {data.length > 10 && <p>... and {data.length - 10} more</p>}
  </div>
);
