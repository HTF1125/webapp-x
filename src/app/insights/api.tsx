// utils/fetchInsights.ts

import { NEXT_PUBLIC_API_URL } from "@/config";
export interface Insight {
  _id: string;
  issuer: string;
  name: string;
  published_date: string; // ISO format date (e.g., "2024-12-06")
  summary?: string | null;
}


export async function fetchInsights({
  search = "",
  skip = 0,
  limit = 100,
}: {
  search?: string;
  skip?: number;
  limit?: number;
}): Promise<Insight[]> {
  // Construct the endpoint with query parameters
  const endpoint = new URL(`/api/insights?skip=${skip}&limit=${limit}`, NEXT_PUBLIC_API_URL);

  // Append the search query parameter if provided
  if (search) {
    endpoint.searchParams.append("search", search);
  }

  try {
    // Fetch the data from the API
    const response = await fetch(endpoint.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store", // Avoid cache for fresh data
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error fetching insights:`, errorData);
      throw new Error(errorData.error || "Failed to fetch insights");
    }

    const data: Insight[] = await response.json();

    // Sort the data by `published_date` in descending order
    return data.sort((a, b) => {
      const dateA = new Date(a.published_date).getTime();
      const dateB = new Date(b.published_date).getTime();
      return dateB - dateA; // Sort by most recent first
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
  const endpoint = `${NEXT_PUBLIC_API_URL}/api/data/insights/tacticalview`;

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

export async function deleteInsight(id: string): Promise<void> {
  if (!id) {
    throw new Error("An ID must be provided to delete an insight");
  }

  const endpoint = `${NEXT_PUBLIC_API_URL}/api/data/insights/${id}`;

  try {
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error deleting insight:`, errorData);
      throw new Error(errorData.detail || "Failed to delete insight");
    }

    console.log(`Insight with ID ${id} successfully deleted.`);
  } catch (error) {
    console.error(`Unexpected error in deleteInsight:`, error);
    throw error;
  }
}

export async function createInsightWithPDF(
  pdfBase64: string
): Promise<Insight> {
  const endpoint = `${NEXT_PUBLIC_API_URL}/api/data/insights/frompdf`;

  try {
    // Construct the payload with the Base64-encoded PDF content
    const payload = {
      content: pdfBase64,
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload), // Send the content in the body
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error creating insight with PDF:`, errorData);
      throw new Error(errorData.detail || "Failed to create insight with PDF");
    }

    return response.json();
  } catch (error) {
    console.error(`Unexpected error in createInsightWithPDF:`, error);
    throw error;
  }
}

export async function updateInsightSummary(id: string): Promise<string> {
  if (!id) {
    throw new Error("An ID must be provided to update an insight summary.");
  }

  const endpoint = `${NEXT_PUBLIC_API_URL}/api/data/insights/${id}/update_summary`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.detail || "Failed to update the insight summary."
      );
    }

    return response.json();
  } catch (error) {
    throw new Error(`Failed to update the insight summary: ${error}`);
  }
}
