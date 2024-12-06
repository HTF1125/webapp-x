import ResearchFilesList from "@/app/insights/ResearchFiles";
import { fetchInsights, Insight } from "@/api/all";
import React from "react";
import Section from "@/components/Section";

export default async function Page() {
  const insights: Insight[] = await fetchInsights();

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center  bg-gray-900"
      style={{ height: "calc(100vh - 100px)" }}
    >
      <div className="w-full h-full overflow-hidden">
        <Section header="Research">
          <ResearchFilesList insights={insights} />
        </Section>
      </div>
    </div>
  );
}
