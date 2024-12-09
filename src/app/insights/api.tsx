// utils/fetchInsights.ts
import { API_URL } from "@/config";
import Insight from "@/api/all";

export async function fetchInsights(
  search: string = "",
  skip: number = 0,
  limit: number = 1000
): Promise<Insight[]> {
  const endpoint = new URL("/api/data/insights/", API_URL);
  endpoint.searchParams.append("skip", skip.toString());
  endpoint.searchParams.append("limit", limit.toString());

  if (search) {
    endpoint.searchParams.append("search", search);
  }

  const response = await fetch(endpoint.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error(`Error fetching insights:`, errorData);
    throw new Error(errorData.error || "Failed to fetch insights");
  }

  const data: Insight[] = await response.json();

  return data.sort((a, b) => {
    const dateA = new Date(a.published_date).getTime();
    const dateB = new Date(b.published_date).getTime();
    return dateB - dateA;
  });
}
