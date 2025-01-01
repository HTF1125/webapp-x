//
import { NEXT_PUBLIC_API_URL } from "@/config";

export async function GET() {
  const endpoint = new URL("/api/performances-grouped", NEXT_PUBLIC_API_URL);

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || "Failed to fetch index groups.");
  }

  const data = await response.json();

  // Set cache headers
  const headers = new Headers({
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
  });

  return new Response(JSON.stringify(data), { status: 200, headers });
}
