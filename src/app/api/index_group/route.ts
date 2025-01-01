// app/api/index_groups/route.ts
import { NEXT_PUBLIC_API_URL } from "@/config";

export async function GET() {
  const endpoint = new URL(
    "/api/data/index_groups/all",
    NEXT_PUBLIC_API_URL
  ).toString();

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
  return new Response(JSON.stringify(data), { status: 200 });
}
