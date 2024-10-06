// lib/api.ts

import { API_URL } from "./url";


export interface apiHealth {
  status: string;
}

export async function checkApiHealth(): Promise<apiHealth> {




  try {
    const fullUrl = API_URL ? `${API_URL}/api/health` : "/api/health";
    const response = await fetch(fullUrl, {
      method: "GET",
      cache: "no-store",
      next: { revalidate: 0 }, // Ensure fresh data on each request
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { status: data.status || "unknown" };
  } catch (error) {
    console.error("Error checking API health:", error);
    return { status: "offline" };
  }
}
