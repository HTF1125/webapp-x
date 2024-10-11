// app/tickers/api.ts

export interface Ticker {
  code: string;
  name: string | null;
  exchange: string | null;
  market: string | null;
  source: string;
  bloomberg: string | null;
  fred: string | null;
  yahoo: string | null;
}

export async function fetchTickers(): Promise<Ticker[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  const fullUrl = `${apiUrl}/api/admin/tickers`;

  const response = await fetch(fullUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch tickers");
  }
  return response.json();
}

export async function fetchTicker(code: string): Promise<Ticker> {
  const apiUrl = process.env.API_URL || "";

  const response = await fetch(`${apiUrl}/api/admin/tickers/${code}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ticker ${code}`);
  }
  return response.json();
}

export async function addTicker(ticker: Ticker): Promise<Ticker> {
  const apiUrl = process.env.API_URL || "";

  const response = await fetch(`${apiUrl}/api/admin/tickers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ticker),
  });
  if (!response.ok) {
    throw new Error("Failed to add ticker");
  }
  return response.json();
}

export async function updateTicker(
  ticker: Ticker
): Promise<{ message: string }> {

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const response = await fetch(`${apiUrl}/api/admin/ticker/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ticker),
  });
  if (!response.ok) {
    throw new Error(`Failed to update ticker ${ticker.code}`);
  }
  return response.json();
}

export async function deleteTicker(code: string): Promise<void> {
  const apiUrl = process.env.API_URL || "";

  const response = await fetch(`${apiUrl}/api/tickers/${code}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete ticker ${code}`);
  }
}
