// app/regimes/page.tsx
import { fetchRegimes } from "./api";
import RegimeSelector from "./RegimeSelector";

function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="w-full p-4 dark:bg-gray-900 text-red-600 dark:text-red-400">
      Error: {message}
    </div>
  );
}

export default async function RegimesPage() {
  try {
    const regimes = await fetchRegimes();

    if (regimes.length === 0) {
      return <ErrorDisplay message="No regime data available" />;
    }

    return (
      <div className="w-full p-4 dark:bg-gray-900">
        <div className="w-[90%] mx-auto">
          <h1 className="text-2xl font-bold mb-4 dark:text-gray-200">
            Regimes
          </h1>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <RegimeSelector regimes={regimes} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return <ErrorDisplay message="Failed to fetch regime data" />;
  }
}
