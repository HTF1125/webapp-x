import { API_URL } from "@/config";

// Fetch the backend task trigger API
export async function fetchBackendTask(): Promise<void> {
  try {
    // Construct the full API endpoint URL
    const endpoint = new URL("/api/tasks/daily", API_URL).toString();

    // Make a GET request to trigger the task
    const response = await fetch(endpoint);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // If successful, handle the response (optional)
    const data = await response.json();
    console.log("Task triggered successfully:", data);

  } catch (error) {
    console.error("Error triggering the task:", error);
    throw error;
  }
}
