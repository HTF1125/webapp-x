import { NEXT_PUBLIC_API_URL } from "@/config";

export interface InsightSource {
  url: string;
  name: string;
  frequency: string;
  last_visited: string;
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
  insightSource: InsightSource
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

// Create a new insight source
export async function updateInsightSource(
  insightSource: InsightSource
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

export async function deleteInsightSource(
  insightSource: InsightSource
): Promise<string> {
  const endpoint = `${NEXT_PUBLIC_API_URL}/api/insightsources`;
  try {
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(insightSource),
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






