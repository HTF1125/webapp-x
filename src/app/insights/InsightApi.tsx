"use client";

import { NEXT_PUBLIC_API_URL } from "@/config";
// Define the Insight interface for type safety
export interface Insight {
  _id: string | null | undefined;
  issuer: string | null;
  name: string | null;
  published_date: string;
  summary: string | null;
}

// Function to fetch insights with added error handling and query parameter management
export async function fetchInsights({
  search = "",
  skip = 0,
  limit = 100,
}: {
  search?: string;
  skip?: number;
  limit?: number;
}): Promise<Insight[]> {
  const endpoint = new URL("/api/insights", NEXT_PUBLIC_API_URL);
  endpoint.searchParams.append("skip", skip.toString());
  endpoint.searchParams.append("limit", limit.toString());

  // Append the search query parameter if provided
  if (search) {
    endpoint.searchParams.append("search", search);
  }

  try {
    const response = await fetch(endpoint.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store", // Ensure fresh data is fetched
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching insights:", errorData);
      throw new Error(errorData.error || "Failed to fetch insights");
    }

    const data: Insight[] = await response.json();

    // Sort the insights by `published_date` in descending order
    return data.sort((a, b) => {
      const dateA = new Date(a.published_date).getTime();
      const dateB = new Date(b.published_date).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Unexpected error in fetchInsights:", error);
    throw error;
  }
}

// Function to update an existing insight
export async function updateInsight(insight: Insight): Promise<Insight> {
  if (!insight._id) {
    throw new Error("Insight _id is undefined.");
  }

  const { ...insightData } = insight;
  const endpoint = `${NEXT_PUBLIC_API_URL}/api/insight`;

  try {
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(insightData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error updating insight:", errorData);
      throw new Error(errorData.detail || "Failed to update insight");
    }

    return response.json();
  } catch (error) {
    console.error("Unexpected error in updateInsight:", error);
    throw error;
  }
}

// Function to delete an insight by ID
export async function deleteInsight(id: string): Promise<void> {
  if (!id) {
    throw new Error("An ID must be provided to delete an insight");
  }

  const endpoint = `${NEXT_PUBLIC_API_URL}/api/insight/${id}`;

  try {
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error deleting insight:", errorData);
      throw new Error(errorData.detail || "Failed to delete insight");
    }

    console.log(`Insight with ID ${id} successfully deleted.`);
  } catch (error) {
    console.error("Unexpected error in deleteInsight:", error);
    throw error;
  }
}

// Function to create an insight from a PDF (Base64 encoded content)
export async function createInsightWithPDF(
  pdfBase64: string,
  filename: string | null = null
): Promise<Insight> {
  if (!pdfBase64) {
    throw new Error("PDF content (Base64) is required.");
  }

  const endpoint = `${NEXT_PUBLIC_API_URL}/api/insight/frompdf`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: pdfBase64, filename }),
    });

    // Check if the response is OK
    if (!response.ok) {
      const contentType = response.headers.get("Content-Type");
      let errorDetail = "Failed to create insight with PDF.";

      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        errorDetail = errorData.detail || errorDetail;
      } else {
        const errorText = await response.text();
        errorDetail = errorText || errorDetail;
      }

      console.error("Error creating insight with PDF:", errorDetail);
      throw new Error(errorDetail);
    }

    // Parse and return the response
    const insight: Insight = await response.json();
    return insight;
  } catch (error) {
    console.error("Unexpected error in createInsightWithPDF:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while creating an insight with PDF."
    );
  }
}


// Function to update the summary of an insight
export async function updateSummary(id: string): Promise<string> {
  if (!id) {
    throw new Error("An ID must be provided to update an insight summary.");
  }

  const endpoint = `${NEXT_PUBLIC_API_URL}/api/insight/summarize/${id}`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error updating summary for insight:", errorData);
      throw new Error(
        errorData.detail || "Failed to update the insight summary."
      );
    }

    return response.json();
  } catch (error) {
    console.error("Unexpected error in updateSummary:", error);
    throw new Error(`Failed to update the insight summary: ${error}`);
  }
}
