import React, { Suspense } from "react";
import StrategiesClient from "./StrategiesClient";
import { fetchStrategies } from "./api";
import Section from "@/components/Section";

export const revalidate = 3600;

export default async function StrategiesPage() {
  const strategies = await fetchStrategies();

  return (
    <Section header="Strategies">
      <div className="w-full">
        <Suspense fallback={<div>Loading strategies...</div>}>
          <StrategiesClient initialStrategies={strategies} />
        </Suspense>
      </div>
    </Section>
  );
}
