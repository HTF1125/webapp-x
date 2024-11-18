import { Suspense } from "react";
import StrategiesClient from "./StrategiesClient";
import { fetchStrategies } from "./api";

export const revalidate = 3600;

export default async function StrategiesPage() {
  const strategies = await fetchStrategies();

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div>Loading strategies...</div>}>
        <StrategiesClient initialStrategies={strategies} />
      </Suspense>
    </div>
  );
}
