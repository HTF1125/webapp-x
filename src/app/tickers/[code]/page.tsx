import { fetchTickerByCode, TickerInfo } from "@/api/all";
import TickerDetailClient from "./TickerDetailsClient";

export default async function TickerDetailPage({ params }: { params: { code: string } }) {
  const { code } = params;
  const ticker = await getTickerDetails(code);

  if (!ticker) {
    return (
      <div className="container mx-auto p-6 bg-black text-gray-100 min-h-screen">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-6 text-red-500">Ticker Not Found</h1>
        </div>
      </div>
    );
  }

  return <TickerDetailClient ticker={ticker} />;
}

async function getTickerDetails(code: string): Promise<TickerInfo | null> {
  try {
    const ticker = await fetchTickerByCode(code);
    return ticker;
  } catch (error) {
    console.error("Error fetching ticker details:", error);
    return null;
  }
}
