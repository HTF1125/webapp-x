// app/tickers/page.tsx
import TickerRow from "./TickerRow"; // Import the Client Component
import { TickerInfo, fetchAllTickers } from "@/api/all";

export default async function TickerTablePage() {
  const tickers = await getTickers();

  return (
    <div className="container">
      <h1 className="title">Tickers</h1>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Exchange</th>
              <th>Market</th>
              <th>Source</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickers.map((ticker) => (
              <TickerRow key={ticker.code} ticker={ticker} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Fetch tickers on the server
async function getTickers(): Promise<TickerInfo[]> {
  try {
    const tickers = await fetchAllTickers();
    return tickers;
  } catch (error) {
    console.error("Error fetching tickers on the server:", error);
    return [];
  }
}
