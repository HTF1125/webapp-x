"use client";

import { fetchData, rurl } from "@/lib/apiClient"; // Adjust the import path as necessary

// Define the MetaData interface for type safety
export interface MetaData {
  code: string;
  name: string | null;
  exchange: string | null;
  market: string | null;
  id_isin: string | null;
  remark: string | null;
  disabled: boolean;
}

// Fetch all metadata with pagination and search
export async function fetchMetadata(
  skip: number = 0,
  limit: number = 100,
  search?: string
): Promise<MetaData[]> {
  const endpoint = rurl("/api/metadata/"); // Use rurl to construct the endpoint
  const queryParams = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString(),
    ...(search && { search }), // Add search parameter if provided
  });

  try {
    const data = await fetchData(`${endpoint}?${queryParams.toString()}`, {}, { method: "GET" });
    return data; // Return the list of metadata
  } catch (error) {
    console.error("Error fetching metadata:", error);
    throw new Error("Failed to fetch metadata. Please try again.");
  }
}

// Create metadata
export async function createMetadata(metadata: MetaData): Promise<MetaData> {
  const endpoint = rurl("/api/metadata"); // Use rurl to construct the endpoint

  try {
    const data = await fetchData(endpoint, metadata, { method: "POST" });
    return data; // Return the created metadata
  } catch (error) {
    console.error("Error creating metadata:", error);
    throw new Error("Failed to create metadata. Please try again.");
  }
}

// Update metadata
export async function updateMetadata(metadata: MetaData): Promise<MetaData> {
  const endpoint = rurl(`/api/metadata/${metadata.code}`); // Use rurl to construct the endpoint

  try {
    const data = await fetchData(endpoint, metadata, { method: "PUT" });
    return data; // Return the updated metadata
  } catch (error) {
    console.error("Error updating metadata:", error);
    throw new Error("Failed to update metadata. Please try again.");
  }
}

// Delete metadata
export async function deleteMetadata(code: string): Promise<void> {
  const endpoint = rurl(`/api/metadata/${code}`); // Use rurl to construct the endpoint

  try {
    await fetchData(endpoint, {}, { method: "DELETE" });
  } catch (error) {
    console.error("Error deleting metadata:", error);
    throw new Error("Failed to delete metadata. Please try again.");
  }
}
