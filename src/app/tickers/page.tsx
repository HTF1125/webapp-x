import { fetchAllTickers } from "@/api/all";
import TickerTableClient from "./TickerTableClient";

export default async function TickerTablePage() {
  const tickers = await fetchAllTickers();

  return (
    <div className="container mx-auto p-4 bg-black text-gray-100 min-h-screen">
      <h1 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
        Ticker Management
      </h1>
      <TickerTableClient initialTickers={tickers} />
    </div>
  );
}
