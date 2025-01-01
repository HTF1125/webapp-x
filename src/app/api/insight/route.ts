// app/api/insight/route.ts
import { NEXT_PUBLIC_API_URL } from "@/config";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search");
    const skip = url.searchParams.get("skip");
    const limit = url.searchParams.get("limit");

    const endpoint = new URL("/api/data/insights", NEXT_PUBLIC_API_URL);
    search ? endpoint.searchParams.append("search", search) : null;
    skip ? endpoint.searchParams.append("skip", skip) : null;
    limit ? endpoint.searchParams.append("limit", limit) : null;
    // Fetch data from the external API
    const response = await fetch(endpoint.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return new Response(
        JSON.stringify({
          error: errorData?.message || "Failed to fetch data.",
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Return the fetched data
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET /api/performance:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}



