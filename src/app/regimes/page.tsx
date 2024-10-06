// app/regimes/page.tsx

import { fetchRegimes, Regime } from "./api";
import RegimeSelector from "./select";

export default async function RegimesPage() {
  let regimes: Regime[] = [];
  let error: string | null = null;

  try {
    regimes = await fetchRegimes();
  } catch (e) {
    console.error("Error fetching regime data:", e);
    error = "Failed to fetch regime data";
  }

  if (error) return <div className="w-full p-4 dark:bg-gray-900 text-red-600 dark:text-red-400">Error: {error}</div>;
  if (regimes.length === 0) return <div className="w-full p-4 dark:bg-gray-900 dark:text-gray-200">No regime data available</div>;

  return (
    <div className="w-full p-4 dark:bg-gray-900">
      <div className="w-[90%] mx-auto">
        <h1 className="text-2xl font-bold mb-4 dark:text-gray-200">Regimes</h1>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <RegimeSelector regimes={regimes} />
        </div>
      </div>
    </div>
  );
}