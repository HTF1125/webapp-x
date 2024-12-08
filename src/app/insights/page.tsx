import ResearchFilesList from "@/app/insights/ResearchFiles";
import React from "react";
import Section from "@/components/Section";



export default async function Page() {

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center  bg-gray-900"
      style={{ height: "calc(100vh - 100px)" }}
    >
      <div className="w-full h-full overflow-hidden">
        <Section header="Insights">
          <ResearchFilesList/>
        </Section>
      </div>
    </div>
  );
}
