import { fetchPerformanceGrouped } from "./DataServices";
import PerformancePageClient from "./PerformanceClientPage";

import { PeriodProvider } from "./PeriodProvider";

// Main PerformancePage component
const PerformancePage = async () => {
  try {
    const performanceGrouped = await fetchPerformanceGrouped();

    return (
      <div className="w-full  mx-auto p-4">
        <PeriodProvider>
          <PerformancePageClient performanceGrouped={performanceGrouped} />
        </PeriodProvider>
      </div>
    );
  } catch (error) {
    console.error("Error fetching performance data:", error);

    return (
      <div className="w-full  mx-auto p-4 text-center text-red-500">
        <p>Failed to load performance data. Please try again later.</p>
      </div>
    );
  }
};

export default PerformancePage;
