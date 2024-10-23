// app/insights/api.ts

import { InsightHeader, Insight } from "./types";

const API_URL = process.env.API_URL || "";

export async function fetchFinancialInsights(): Promise<InsightHeader[]> {
  const url = new URL("/api/data/insights", API_URL);

  console.log("Fetching from URL:", url.toString());

  const fetchOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  };

  try {
    const response = await fetch(url.toString(), fetchOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid data format: expected an array");
    }

    return data as InsightHeader[];
  } catch (error) {
    console.error("Error fetching financial insights:", error);
    throw error;
  }
}


export async function fetchInsightDetails(id: string): Promise<Insight> {
  const url = new URL(`/api/data/insights/${id}`, API_URL);

  const fetchOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    next: { revalidate: 60 },
  };

  try {
    const response = await fetch(url.toString(), fetchOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data as Insight;
  } catch (error) {
    console.error(`Error fetching insight details for id ${id}:`, error);
    throw error;
  }
}
