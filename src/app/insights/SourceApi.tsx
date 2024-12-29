import { NEXT_PUBLIC_API_URL } from "@/config";

// Define the TypeScript type for an InsightSource
export interface InsightSource {
  _id?: string;
  url: string;
  name: string | null;
  frequency: string | null;
  last_visited: string | null;
  remark: string | null;
}

// Fetch all insight sources
export async function fetchInsightSources(): Promise<InsightSource[]> {
  const endpoint = `${NEXT_PUBLIC_API_URL}/api/insightsources`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching insight sources:", errorData);
      throw new Error(errorData.detail || "Failed to fetch insight sources.");
    }

    return response.json();
  } catch (error) {
    console.error("Unexpected error in fetchInsightSources:", error);
    throw new Error(`Failed to fetch insight sources: ${error}`);
  }
}

// Create a new insight source
export async function createInsightSource(
  insightSource: Omit<InsightSource, "_id">
): Promise<InsightSource> {
  const endpoint = `${NEXT_PUBLIC_API_URL}/api/insightsources`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(insightSource),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error creating insight source:", errorData);
      throw new Error(errorData.detail || "Failed to create insight source.");
    }

    return response.json();
  } catch (error) {
    console.error("Unexpected error in createInsightSource:", error);
    throw new Error(`Failed to create insight source: ${error}`);
  }
}

// Update an existing insight source
export async function updateInsightSource(
  insightSource: Required<InsightSource>
): Promise<InsightSource> {
  if (!insightSource._id) {
    throw new Error("_id must be provided when updating an insight source.");
  }

  const endpoint = `${NEXT_PUBLIC_API_URL}/api/insightsources/${insightSource._id}`;
  try {
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(insightSource),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error updating insight source:", errorData);
      throw new Error(errorData.detail || "Failed to update insight source.");
    }

    return response.json();
  } catch (error) {
    console.error("Unexpected error in updateInsightSource:", error);
    throw new Error(`Failed to update insight source: ${error}`);
  }
}

// Delete an insight source
export async function deleteInsightSource(id: string): Promise<string> {
  if (!id) {
    throw new Error("ID must be provided to delete an insight source.");
  }

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
      console.error("Error deleting insight source:", errorData);
      throw new Error(errorData.detail || "Failed to delete insight source.");
    }

    const data = await response.json();
    return data.message || "Insight source deleted successfully.";
  } catch (error) {
    console.error("Unexpected error in deleteInsightSource:", error);
    throw new Error(`Failed to delete insight source: ${error}`);
  }
}
