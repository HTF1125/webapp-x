"use client";

import { fetchData, rurl } from "@/lib/apiClient"; // Adjust the import path as necessary

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
  const endpoint = rurl("/api/insights"); // Use rurl to construct the endpoint
  const params = { search, skip, limit };

  try {
    const data = await fetchData(endpoint, params, { method: "GET" });
    
    // Sort the insights by `published_date` in descending order
    return data.sort((a: Insight, b: Insight) => {
      const dateA = new Date(a.published_date).getTime();
      const dateB = new Date(b.published_date).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Error fetching insights:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
}

// Function to update an existing insight
export async function updateInsight(insight: Insight): Promise<Insight> {
  if (!insight._id) {
    throw new Error("Insight _id is undefined.");
  }

  const endpoint = rurl(`/api/insight`); // Construct endpoint with ID

  try {
    const data = await fetchData(endpoint, insight, { method: "PUT" });
    return data; // Return the updated insight data
  } catch (error) {
    console.error("Error updating insight:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
}

// Function to delete an insight by ID
export async function deleteInsight(id: string): Promise<void> {
  if (!id) {
    throw new Error("An ID must be provided to delete an insight");
  }

  const endpoint = rurl(`/api/insight/${id}`); // Construct endpoint with ID

  try {
    await fetchData(endpoint, {}, { method: "DELETE" });
    console.log(`Insight with ID ${id} successfully deleted.`);
  } catch (error) {
    console.error("Error deleting insight:", error);
    throw error; // Rethrow the error for handling in the calling function
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

  const endpoint = rurl("/api/insight/frompdf");

  try {
    const data = await fetchData(endpoint, { content: pdfBase64, filename }, { method: "POST" });
    return data; // Return the created insight
  } catch (error) {
    console.error("Unexpected error in createInsightWithPDF:", error);
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred while creating an insight with PDF."
    );
  }
}

// Function to update the summary of an insight
export async function updateSummary(id: string): Promise<string> {
  if (!id) {
    throw new Error("An ID must be provided to update an insight summary.");
  }

  const endpoint = rurl(`/api/insight/summarize/${id}`);

  try {
    const data = await fetchData(endpoint, {}, { method: "POST" });
    return data; // Return the updated summary
  } catch (error) {
    console.error("Unexpected error in updateSummary:", error);
    throw new Error(`Failed to update the insight summary: ${error}`);
  }
}


// Define the CreateInsightSource and InsightSource interfaces for type safety
export interface CreateInsightSource {
  url: string;
  name: string;
  frequency: string;
  last_visited: string;
  remark: string | null;
}

export interface InsightSource extends CreateInsightSource {
  _id: string;
}

// Fetch all insight sources
export async function fetchInsightSources(): Promise<InsightSource[]> {
  const endpoint = rurl("/api/insightsources"); // Use rurl to construct the endpoint

  try {
    const data = await fetchData(endpoint, {}, { method: "GET" });
    return data; // Return the list of insight sources
  } catch (error) {
    console.error("Unexpected error in fetchInsightSources:", error);
    throw new Error(`Failed to fetch insight sources: ${error}`);
  }
}

// Create a new insight source
export async function createInsightSource(
  insightSource: Omit<InsightSource, "_id">
): Promise<InsightSource> {
  const endpoint = rurl("/api/insightsources"); // Use rurl to construct the endpoint

  try {
    const data = await fetchData(endpoint, insightSource, { method: "POST" });
    return data; // Return the created insight source
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

  const endpoint = rurl(`/api/insightsources`); // Use rurl to construct the endpoint

  try {
    const data = await fetchData(endpoint, insightSource, { method: "PUT" });
    return data; // Return the updated insight source
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

  const endpoint = rurl(`/api/insightsources/${id}`); // Use rurl to construct the endpoint

  try {
    await fetchData(endpoint, {}, { method: "DELETE" });
    return "Insight source deleted successfully."; // Return success message
  } catch (error) {
    console.error("Unexpected error in deleteInsightSource:", error);
    throw new Error(`Failed to delete insight source: ${error}`);
  }
}
