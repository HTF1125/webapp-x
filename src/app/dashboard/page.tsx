// /dashboard/page.tsx

import React from "react";
import SignalSection from "./_signal/page";
import PerformancePage from "./_performance/page";


export default async function DashboardPage() {
  // Fetch data on the server side

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="w-full box-border">
        <PerformancePage />
      </div>

      <div className="w-full box-border">
        <SignalSection />
      </div>
    </div>
  );
}
