"use client";

import { fetchData, rurl } from "@/lib/apiClient";

// Update the MetaData interface to match the backend model
export interface Source {
  field: string;
  s_code: string;
  s_field: string;
  source: string;
}

export interface MetaData {
  code: string;
  exchange: string | null;
  market: string | null;
  id_isin: string | null;
  name: string | null;
  remark: string | null;
  disabled: boolean;
  data_sources: Source[];
}

// Fetch all metadata with pagination and search
export async function fetchMetadata(
  skip: number = 0,
  limit: number = 100,
  search?: string
): Promise<MetaData[]> {
  const endpoint = rurl("api/metadata/");
  const queryParams = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString(),
    ...(search && { search }),
  });

  try {
    const data = await fetchData(`${endpoint}?${queryParams.toString()}`, {}, { method: "GET" });
    return data;
  } catch (error) {
    console.error("Error fetching metadata:", error);
    throw new Error("Failed to fetch metadata. Please try again.");
  }
}

// Create metadata
export async function createMetadata(metadata: MetaData): Promise<MetaData> {
  const endpoint = rurl("api/metadata/");

  try {
    const data = await fetchData(endpoint, metadata, { method: "POST" });
    return data;
  } catch (error) {
    console.error("Error creating metadata:", error);
    throw new Error("Failed to create metadata. Please try again.");
  }
}

// Update metadata
export async function updateMetadata(metadata: MetaData): Promise<MetaData> {
  const endpoint = rurl("api/metadata/");

  try {
    const data = await fetchData(endpoint, metadata, { method: "PUT" });
    return data;
  } catch (error) {
    console.error("Error updating metadata:", error);
    throw new Error("Failed to update metadata. Please try again.");
  }
}

// Delete metadata
export async function deleteMetadata(code: string): Promise<void> {
  const endpoint = rurl(`api/metadata/${code}`);

  try {
    await fetchData(endpoint, {}, { method: "DELETE" });
  } catch (error) {
    console.error("Error deleting metadata:", error);
    throw new Error("Failed to delete metadata. Please try again.");
  }
}

// New function to get metadata by code
export async function getMetadataByCode(code: string): Promise<MetaData> {
  const endpoint = rurl(`/api/metadata/${code}`);

  try {
    const data = await fetchData(endpoint, {}, { method: "GET" });
    return data;
  } catch (error) {
    console.error("Error fetching metadata by code:", error);
    throw new Error("Failed to fetch metadata. Please try again.");
  }
}
