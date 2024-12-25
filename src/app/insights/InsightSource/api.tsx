import { NEXT_PUBLIC_API_URL } from "@/config";

// Define the TypeScript type for an InsightSource
export interface InsightSource {
  _id: string;
  url: string;
  name: string | null;
  last_visited: string;
  remark: string | null;
}

export async function fetchInsightSources(): Promise<InsightSource[]> {
  const endpoint = `${NEXT_PUBLIC_API_URL}/api/insightsources`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error fetching insight sources:`, errorData);
      throw new Error(errorData.detail || "Failed to fetch insight sources.");
    }

    const data: InsightSource[] = await response.json();
    return data;
  } catch (error) {
    console.error(`Unexpected error in fetchInsightSources:`, error);
    throw new Error(`Failed to fetch insight sources: ${error}`);
  }
}

export interface UrlData {
  url: string;
  name?: string;
}

/**
 * Function to create a new InsightSource
 * @param urlData - The URL data containing the URL and optional name
 * @returns The created InsightSource object
 */
export async function createInsightSource(
  urlData: UrlData
): Promise<InsightSource> {
  const endpoint = `${NEXT_PUBLIC_API_URL}/api/insightsources`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(urlData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error creating insight source:`, errorData);
      throw new Error(errorData.detail || "Failed to create insight source.");
    }

    const data: InsightSource = await response.json();
    return data;
  } catch (error) {
    console.error(`Unexpected error in createInsightSource:`, error);
    throw new Error(`Failed to create insight source: ${error}`);
  }
}

export interface InsightSourceUpdate {
  url?: string;
  name?: string;
  remark?: string;
  last_visited?: string;
}

export async function updateInsightSource(
  id: string,
  updateData: InsightSourceUpdate
): Promise<InsightSource> {
  const endpoint = `${NEXT_PUBLIC_API_URL}/api/insightsources/${id}`;

  try {
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error updating insight source:`, errorData);
      throw new Error(errorData.detail || "Failed to update insight source.");
    }

    const data: InsightSource = await response.json();
    return data;
  } catch (error) {
    console.error(`Unexpected error in updateInsightSource:`, error);
    throw new Error(`Failed to update insight source: ${error}`);
  }
}

export async function deleteInsightSource(id: string): Promise<string> {
  const endpoint = `${NEXT_PUBLIC_API_URL}/api/insightsources/${id}`;

  try {
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error deleting insight source:`, errorData);
      throw new Error(errorData.detail || "Failed to delete insight source.");
    }

    const data = await response.json();
    return data.message || "Insight source deleted successfully.";
  } catch (error) {
    console.error(`Unexpected error in deleteInsightSource:`, error);
    throw new Error(`Failed to delete insight source: ${error}`);
  }
}
