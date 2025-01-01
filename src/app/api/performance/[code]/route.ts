// app/api/performance/route.ts
import { NEXT_PUBLIC_API_URL } from "@/config";

// GET handler for the performance endpoint
export async function GET(request: Request) {
  try {
    // Extract 'code' from query parameters
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return new Response(
        JSON.stringify({ error: "Missing 'code' query parameter." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Construct the endpoint URL
    const endpoint = new URL("api/performance", NEXT_PUBLIC_API_URL);
    endpoint.searchParams.append("code", code);
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
