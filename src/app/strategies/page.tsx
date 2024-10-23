// app/strategies/page.tsx

import { Suspense } from "react";
import StrategiesClient from "./StrategiesClient";
import { fetchStrategies } from "./api";

export const revalidate = 3600; // Revalidate every hour

export default async function StrategiesPage() {
  const strategies = await fetchStrategies();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Strategies</h1>
      <Suspense fallback={<div>Loading strategies...</div>}>
        <StrategiesClient initialStrategies={strategies} />
      </Suspense>
    </div>
  );
}
