import PerformancePageClient from "./PerformanceClientPage";
import { PeriodProvider } from "./PeriodProvider";
import { fetchPerformanceGrouped } from "@/services/perfApi";

// Main PerformancePage component
const PerformancePage = async () => {
  try {
    // Fetch the data
    const performanceGrouped = await fetchPerformanceGrouped();

    // Transform the data to ensure it matches the PerformanceData type
    const performanceData = performanceGrouped.map((item) => ({
      group: item.group,
      code: item.code,
      name: item.name,
      pct_chg_1d: item.pct_chg_1d ?? 0, // Default undefined values to 0
      pct_chg_1w: item.pct_chg_1w ?? 0,
      pct_chg_1m: item.pct_chg_1m ?? 0,
      pct_chg_3m: item.pct_chg_3m ?? 0,
      pct_chg_6m: item.pct_chg_6m ?? 0,
      pct_chg_1y: item.pct_chg_1y ?? 0,
      pct_chg_mtd: item.pct_chg_mtd ?? 0,
      pct_chg_ytd: item.pct_chg_ytd ?? 0,
    }));

    return (
      <div className="w-full p-2 rounded-lg">
        <PeriodProvider>
          <PerformancePageClient performanceGrouped={performanceData} />
        </PeriodProvider>
      </div>
    );
  } catch (error) {
    console.error("Error fetching performance data:", error);

    return (
      <div className="w-full mx-auto p-4 text-center text-red-500 bg-red-100 rounded-lg">
        <p>Failed to load performance data. Please try again later.</p>
      </div>
    );
  }
};

export default PerformancePage;
