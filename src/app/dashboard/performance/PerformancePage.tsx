// import { fetchPerformanceGrouped } from "./DataServices";
import PerformancePageClient from "./PerformanceClientPage";
import { PeriodProvider } from "./PeriodProvider";
import { fetchPerformanceGrouped } from "@/services/perfApi";

// Main PerformancePage component
const PerformancePage = async () => {
  try {
    const performanceGrouped = await fetchPerformanceGrouped();

    return (
      <div className="w-full p-6 shadow-lg rounded-lg">
        <PeriodProvider>
          <PerformancePageClient performanceGrouped={performanceGrouped} />
        </PeriodProvider>
      </div>
    );
  } catch (error) {
    console.error("Error fetching performance data:", error);

    return (
      <div className="w-full max-w-5xl mx-auto p-4 text-center text-red-500 bg-red-100 rounded-lg shadow-md">
        <p>Failed to load performance data. Please try again later.</p>
      </div>
    );
  }
};

export default PerformancePage;
