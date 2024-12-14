// utils/fetchInsights.ts

import { NEXT_PUBLIC_API_URL } from "@/config";
import Insight from "@/api/all";

export async function fetchInsights(
  search: string = "",
  skip: number = 0,
  limit: number = 1000
): Promise<Insight[]> {
  const endpoint = new URL("/api/data/insights/", NEXT_PUBLIC_API_URL);
  endpoint.searchParams.append("skip", skip.toString());
  endpoint.searchParams.append("limit", limit.toString());

  if (search) {
    endpoint.searchParams.append("search", search);
  }

  try {
    const response = await fetch(endpoint.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
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
  } catch (error) {
    console.error(`Unexpected error in fetchInsights:`, error);
    throw error;
  }
}

interface CreateInsightPayload {
  // Define the expected structure of the payload here.
  [key: string]: unknown;
}

export async function createInsight(
  payload: CreateInsightPayload
): Promise<Insight> {
  const endpoint = `${NEXT_PUBLIC_API_URL}/api/data/insights/new`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error creating insight:`, errorData);
      throw new Error(errorData.detail || "Failed to create insight");
    }

    return response.json();
  } catch (error) {
    console.error(`Unexpected error in createInsight:`, error);
    throw error;
  }
}

export async function updateInsight(
  payload: Record<string, unknown>,
  id?: string
): Promise<Insight> {
  const endpoint = id
    ? `${NEXT_PUBLIC_API_URL}/api/data/insights/update/${id}`
    : `${NEXT_PUBLIC_API_URL}/api/data/insights/new`;

  const method = id ? "PUT" : "POST";

  try {
    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        `Error ${id ? "updating" : "creating"} insight:`,
        errorData
      );
      throw new Error(
        errorData.detail || `Failed to ${id ? "update" : "create"} insight`
      );
    }

    return response.json();
  } catch (error) {
    console.error(
      `Unexpected error in ${id ? "update" : "create"}Insight:`,
      error
    );
    throw error;
  }
}

// interfaces/TacticalView.ts
export interface TacticalView {
  views: Record<string, any>; // Represents a dictionary with string keys and any type of values
  published_date: Date; // Represents the published_date as a Date object
}

export async function fetchTacticalView(): Promise<TacticalView> {
  const endpoint = `${NEXT_PUBLIC_API_URL}/api/data/insights/streetview`;

  try {
    const response = await fetch(endpoint, {
      method: "GET", // Adjusted to GET to match the purpose of fetching a street view
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error fetching street view:`, errorData);
      throw new Error(errorData.detail || "Failed to fetch street view");
    }

    // Parse the response JSON and map `published_date` to a Date object
    const data = await response.json();
    return {
      ...data,
      published_date: new Date(data.published_date), // Ensure the published_date is a Date object
    };
  } catch (error) {
    console.error(`Unexpected error in fetchStreetView:`, error);
    throw error;
  }
}